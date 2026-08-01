#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, vec, Env};

/// The agent contract as built wasm. The factory deploys instances from this
/// hash, so the test exercises the real deploy path rather than a stub.
mod agent_contract {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32v1-none/release/agent.wasm"
    );
}

struct Fixture {
    env: Env,
    client: FactoryClient<'static>,
    admin: Address,
}

fn setup() -> Fixture {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let id = env.register(Factory, (admin.clone(),));
    let client = FactoryClient::new(&env, &id);

    let wasm_hash = env.deployer().upload_contract_wasm(agent_contract::WASM);
    client.set_wasm(&wasm_hash);

    Fixture { env, client, admin }
}

fn details(env: &Env) -> (String, String, String, Vec<String>) {
    (
        String::from_str(env, "summarize.fn"),
        String::from_str(env, "https://example.com/x402/summarize"),
        String::from_str(env, "Condenses long documents into structured summaries."),
        vec![env, String::from_str(env, "text")],
    )
}

#[test]
fn deploys_an_agent_and_indexes_it() {
    let Fixture { env, client, .. } = setup();
    let owner = Address::generate(&env);
    let payto = Address::generate(&env);
    let (name, endpoint, description, tags) = details(&env);

    let agent = client.deploy_agent(&owner, &payto, &name, &endpoint, &description, &tags);

    assert_eq!(client.count(), 1);
    assert_eq!(client.list(&0, &10), vec![&env, agent.clone()]);
    assert_eq!(client.agent_of(&payto), agent);
}

#[test]
fn the_deployed_agent_holds_the_details() {
    let Fixture { env, client, .. } = setup();
    let owner = Address::generate(&env);
    let payto = Address::generate(&env);
    let (name, endpoint, description, tags) = details(&env);

    let agent = client.deploy_agent(&owner, &payto, &name, &endpoint, &description, &tags);

    // Read back through the agent's own interface — this is what the indexer
    // and the MCP server will do.
    let agent_client = agent_contract::Client::new(&env, &agent);
    let info = agent_client.info();

    assert_eq!(info.owner, owner);
    assert_eq!(info.payto, payto);
    assert_eq!(info.name, name);
    assert_eq!(info.endpoint, endpoint);
}

#[test]
fn one_listing_per_payment_address() {
    let Fixture { env, client, .. } = setup();
    let owner = Address::generate(&env);
    let payto = Address::generate(&env);
    let (name, endpoint, description, tags) = details(&env);

    client.deploy_agent(&owner, &payto, &name, &endpoint, &description, &tags);

    let second = client.try_deploy_agent(&owner, &payto, &name, &endpoint, &description, &tags);
    assert_eq!(second, Err(Ok(Error::AlreadyRegistered)));
    assert_eq!(client.count(), 1, "a rejected deploy must not be counted");
}

#[test]
fn each_agent_gets_its_own_contract_address() {
    let Fixture { env, client, .. } = setup();
    let owner = Address::generate(&env);
    let (name, endpoint, description, tags) = details(&env);

    let a = client.deploy_agent(
        &owner,
        &Address::generate(&env),
        &name,
        &endpoint,
        &description,
        &tags,
    );
    let b = client.deploy_agent(
        &owner,
        &Address::generate(&env),
        &name,
        &endpoint,
        &description,
        &tags,
    );

    assert_ne!(a, b);
    assert_eq!(client.count(), 2);
}

#[test]
fn list_paginates_and_clamps() {
    let Fixture { env, client, .. } = setup();
    let owner = Address::generate(&env);
    let (name, endpoint, description, tags) = details(&env);

    for _ in 0..5 {
        client.deploy_agent(
            &owner,
            &Address::generate(&env),
            &name,
            &endpoint,
            &description,
            &tags,
        );
    }

    assert_eq!(client.list(&0, &2).len(), 2);
    assert_eq!(client.list(&3, &10).len(), 2, "limit clamps to count");
    assert_eq!(client.list(&5, &10).len(), 0, "start past the end is empty");
    assert_eq!(client.list(&0, &0).len(), 0);
}

#[test]
fn unknown_payment_address_has_no_listing() {
    let Fixture { env, client, .. } = setup();
    assert_eq!(
        client.try_agent_of(&Address::generate(&env)),
        Err(Ok(Error::NotFound))
    );
}

#[test]
fn deploy_fails_before_a_wasm_is_set() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let id = env.register(Factory, (admin,));
    let client = FactoryClient::new(&env, &id);
    let (name, endpoint, description, tags) = details(&env);

    assert_eq!(
        client.try_deploy_agent(
            &Address::generate(&env),
            &Address::generate(&env),
            &name,
            &endpoint,
            &description,
            &tags,
        ),
        Err(Ok(Error::WasmNotSet))
    );
}

#[test]
fn admin_is_recorded_and_wasm_is_readable() {
    let Fixture { client, admin, .. } = setup();
    assert_eq!(client.admin(), admin);
    // Set during setup; reading it back proves set_wasm persisted.
    client.wasm();
}
