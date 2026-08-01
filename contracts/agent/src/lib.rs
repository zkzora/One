#![no_std]
use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, symbol_short, Address, Env,
    String, Symbol, Vec,
};

/// ~5s per ledger.
const DAY_IN_LEDGERS: u32 = 17280;
const BUMP_AMOUNT: u32 = DAY_IN_LEDGERS * 30;
const BUMP_THRESHOLD: u32 = DAY_IN_LEDGERS * 15;

const RECORD: Symbol = symbol_short!("RECORD");

/// Limits mirror the registration form. Enforced here as well as in the UI,
/// because the contract is the thing anyone can call directly.
const MAX_NAME: u32 = 64;
const MAX_ENDPOINT: u32 = 256;
const MAX_DESCRIPTION: u32 = 512;
const MAX_TAGS: u32 = 8;
const MAX_TAG_LEN: u32 = 32;

#[contracttype]
#[derive(Clone)]
pub struct AgentInfo {
    /// Controls the listing. Transferable.
    pub owner: Address,
    /// Where callers pay. Immutable — reputation is derived from this address's
    /// payment history, so changing it would silently reset the record.
    pub payto: Address,
    pub name: String,
    pub endpoint: String,
    pub description: String,
    pub tags: Vec<String>,
    pub registered_at: u64,
    pub updated_at: u64,
}

/// Emitted whenever the editable fields change, so an indexer can refresh a
/// listing without polling every agent contract.
#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Updated {
    #[topic]
    pub payto: Address,
    pub updated_at: u64,
}

/// Emitted when the listing changes hands. `payto` deliberately does not move.
#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OwnerTransferred {
    #[topic]
    pub payto: Address,
    pub previous: Address,
    pub current: Address,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialised = 1,
    NameTooLong = 2,
    EndpointTooLong = 3,
    DescriptionTooLong = 4,
    TooManyTags = 5,
    TagTooLong = 6,
    NameEmpty = 7,
    EndpointEmpty = 8,
}

#[contract]
pub struct Agent;

#[contractimpl]
impl Agent {
    /// Runs once, at deploy time. The factory passes the operator's details
    /// straight through, so a listing exists the moment its contract does.
    pub fn __constructor(
        env: Env,
        owner: Address,
        payto: Address,
        name: String,
        endpoint: String,
        description: String,
        tags: Vec<String>,
    ) {
        validate(&name, &endpoint, &description, &tags).unwrap_optimized_or_panic();

        let now = env.ledger().timestamp();
        let record = AgentInfo {
            owner,
            payto,
            name,
            endpoint,
            description,
            tags,
            registered_at: now,
            updated_at: now,
        };

        env.storage().instance().set(&RECORD, &record);
        env.storage()
            .instance()
            .extend_ttl(BUMP_THRESHOLD, BUMP_AMOUNT);
    }

    /// The full listing.
    pub fn info(env: Env) -> Result<AgentInfo, Error> {
        let record: AgentInfo = env
            .storage()
            .instance()
            .get(&RECORD)
            .ok_or(Error::NotInitialised)?;
        env.storage()
            .instance()
            .extend_ttl(BUMP_THRESHOLD, BUMP_AMOUNT);
        Ok(record)
    }

    /// Where this agent is paid. Read on its own by the indexer, which does not
    /// need the rest of the record.
    pub fn payto(env: Env) -> Result<Address, Error> {
        Ok(Self::info(env)?.payto)
    }

    pub fn owner(env: Env) -> Result<Address, Error> {
        Ok(Self::info(env)?.owner)
    }

    /// Edit everything except `payto`.
    pub fn update(
        env: Env,
        name: String,
        endpoint: String,
        description: String,
        tags: Vec<String>,
    ) -> Result<(), Error> {
        let mut record: AgentInfo = env
            .storage()
            .instance()
            .get(&RECORD)
            .ok_or(Error::NotInitialised)?;

        record.owner.require_auth();
        validate(&name, &endpoint, &description, &tags)?;

        record.name = name;
        record.endpoint = endpoint;
        record.description = description;
        record.tags = tags;
        record.updated_at = env.ledger().timestamp();

        env.storage().instance().set(&RECORD, &record);
        env.storage()
            .instance()
            .extend_ttl(BUMP_THRESHOLD, BUMP_AMOUNT);

        Updated {
            payto: record.payto.clone(),
            updated_at: record.updated_at,
        }
        .publish(&env);

        Ok(())
    }

    /// Hand the listing to someone else. The payment address does not move,
    /// so the track record stays attached to where the money actually went.
    pub fn transfer_owner(env: Env, new_owner: Address) -> Result<(), Error> {
        let mut record: AgentInfo = env
            .storage()
            .instance()
            .get(&RECORD)
            .ok_or(Error::NotInitialised)?;

        record.owner.require_auth();

        let previous = record.owner.clone();
        record.owner = new_owner.clone();
        record.updated_at = env.ledger().timestamp();

        env.storage().instance().set(&RECORD, &record);
        env.storage()
            .instance()
            .extend_ttl(BUMP_THRESHOLD, BUMP_AMOUNT);

        OwnerTransferred {
            payto: record.payto.clone(),
            previous,
            current: new_owner,
        }
        .publish(&env);

        Ok(())
    }
}

fn validate(
    name: &String,
    endpoint: &String,
    description: &String,
    tags: &Vec<String>,
) -> Result<(), Error> {
    if name.len() == 0 {
        return Err(Error::NameEmpty);
    }
    if name.len() > MAX_NAME {
        return Err(Error::NameTooLong);
    }
    if endpoint.len() == 0 {
        return Err(Error::EndpointEmpty);
    }
    if endpoint.len() > MAX_ENDPOINT {
        return Err(Error::EndpointTooLong);
    }
    if description.len() > MAX_DESCRIPTION {
        return Err(Error::DescriptionTooLong);
    }
    if tags.len() > MAX_TAGS {
        return Err(Error::TooManyTags);
    }
    for tag in tags.iter() {
        if tag.len() > MAX_TAG_LEN {
            return Err(Error::TagTooLong);
        }
    }
    Ok(())
}

/// Constructors cannot return a `Result`, so a rejected registration has to
/// abort the deploy outright. This keeps the failure explicit at the call site.
trait UnwrapOptimizedOrPanic {
    fn unwrap_optimized_or_panic(self);
}

impl UnwrapOptimizedOrPanic for Result<(), Error> {
    fn unwrap_optimized_or_panic(self) {
        if self.is_err() {
            panic!("invalid agent details");
        }
    }
}

mod test;
