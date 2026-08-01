#![no_std]
use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, symbol_short, xdr::ToXdr,
    Address, BytesN, Env, String, Symbol, Vec,
};

/// ~5s per ledger.
const DAY_IN_LEDGERS: u32 = 17280;
const BUMP_AMOUNT: u32 = DAY_IN_LEDGERS * 30;
const BUMP_THRESHOLD: u32 = DAY_IN_LEDGERS * 15;

const ADMIN: Symbol = symbol_short!("ADMIN");
const WASM: Symbol = symbol_short!("WASM");
const COUNT: Symbol = symbol_short!("COUNT");

#[contracttype]
pub enum DataKey {
    /// slot -> agent contract address.
    ///
    /// One ledger entry per slot rather than a single growing Vec: a Vec would
    /// eventually exceed the entry size limit and brick every function on this
    /// contract — a failure auditors have reported on Soroban more than once.
    Index(u32),
    /// payment address -> agent contract address. Stops one address being listed
    /// twice, which would split its track record across two listings.
    ByPayto(Address),
}

/// Emitted for each new listing. Indexers watch this instead of walking the
/// whole index on every poll.
#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Deployed {
    #[topic]
    pub payto: Address,
    pub agent: Address,
    pub slot: u32,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    WasmNotSet = 1,
    AlreadyRegistered = 2,
    NotFound = 3,
}

#[contract]
pub struct Factory;

#[contractimpl]
impl Factory {
    pub fn __constructor(env: Env, admin: Address) {
        env.storage().instance().set(&ADMIN, &admin);
        env.storage()
            .instance()
            .extend_ttl(BUMP_THRESHOLD, BUMP_AMOUNT);
    }

    /// Point the factory at an uploaded agent wasm.
    ///
    /// The wasm is uploaded once and every listing is deployed from that hash.
    /// That is what keeps per-agent contracts affordable — deploying from an
    /// existing hash costs a fraction of uploading the code again.
    pub fn set_wasm(env: Env, wasm_hash: BytesN<32>) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();

        env.storage().instance().set(&WASM, &wasm_hash);
        env.storage()
            .instance()
            .extend_ttl(BUMP_THRESHOLD, BUMP_AMOUNT);
    }

    pub fn wasm(env: Env) -> Result<BytesN<32>, Error> {
        env.storage().instance().get(&WASM).ok_or(Error::WasmNotSet)
    }

    pub fn admin(env: Env) -> Address {
        env.storage().instance().get(&ADMIN).unwrap()
    }

    /// Deploy a listing. Returns the new agent contract's address.
    ///
    /// Anyone may call this — there is no approval queue, by design. The only
    /// gate is that a payment address cannot be listed twice.
    pub fn deploy_agent(
        env: Env,
        owner: Address,
        payto: Address,
        name: String,
        endpoint: String,
        description: String,
        tags: Vec<String>,
    ) -> Result<Address, Error> {
        owner.require_auth();

        let wasm_hash: BytesN<32> = env
            .storage()
            .instance()
            .get(&WASM)
            .ok_or(Error::WasmNotSet)?;

        let payto_key = DataKey::ByPayto(payto.clone());
        if env.storage().persistent().has(&payto_key) {
            return Err(Error::AlreadyRegistered);
        }

        // Deterministic salt: one listing per payment address, and the contract
        // address is knowable before the deploy lands.
        let salt: BytesN<32> = env.crypto().sha256(&payto.clone().to_xdr(&env)).to_bytes();

        let agent = env.deployer().with_current_contract(salt).deploy_v2(
            wasm_hash,
            (owner, payto.clone(), name, endpoint, description, tags),
        );

        let slot: u32 = env.storage().instance().get(&COUNT).unwrap_or(0);
        env.storage().persistent().set(&DataKey::Index(slot), &agent);
        env.storage().persistent().set(&payto_key, &agent);
        env.storage().instance().set(&COUNT, &(slot + 1));

        bump(&env, &DataKey::Index(slot));
        bump(&env, &payto_key);
        env.storage()
            .instance()
            .extend_ttl(BUMP_THRESHOLD, BUMP_AMOUNT);

        Deployed {
            payto,
            agent: agent.clone(),
            slot,
        }
        .publish(&env);

        Ok(agent)
    }

    /// Page through listings. Returns contract addresses; callers read the
    /// details from each agent contract directly.
    pub fn list(env: Env, start: u32, limit: u32) -> Vec<Address> {
        let count: u32 = env.storage().instance().get(&COUNT).unwrap_or(0);
        let mut out = Vec::new(&env);
        if start >= count {
            return out;
        }
        let end = core::cmp::min(start.saturating_add(limit), count);
        for slot in start..end {
            if let Some(addr) = env
                .storage()
                .persistent()
                .get::<DataKey, Address>(&DataKey::Index(slot))
            {
                out.push_back(addr);
            }
        }
        out
    }

    pub fn count(env: Env) -> u32 {
        env.storage().instance().get(&COUNT).unwrap_or(0)
    }

    /// Find a listing from the address it is paid at.
    pub fn agent_of(env: Env, payto: Address) -> Result<Address, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::ByPayto(payto))
            .ok_or(Error::NotFound)
    }
}

fn bump(env: &Env, key: &DataKey) {
    env.storage()
        .persistent()
        .extend_ttl(key, BUMP_THRESHOLD, BUMP_AMOUNT);
}

mod test;
