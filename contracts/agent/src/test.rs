#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger as _},
    vec, Env,
};

fn details(env: &Env) -> (String, String, String, Vec<String>) {
    (
        String::from_str(env, "summarize.fn"),
        String::from_str(env, "https://example.com/x402/summarize"),
        String::from_str(env, "Condenses long documents into structured summaries."),
        vec![env, String::from_str(env, "text")],
    )
}

fn deploy(env: &Env) -> (AgentClient<'static>, Address, Address) {
    let owner = Address::generate(env);
    let payto = Address::generate(env);
    let (name, endpoint, description, tags) = details(env);
    let id = env.register(
        Agent,
        (
            owner.clone(),
            payto.clone(),
            name,
            endpoint,
            description,
            tags,
        ),
    );
    (AgentClient::new(env, &id), owner, payto)
}

#[test]
fn constructor_stores_the_listing() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, owner, payto) = deploy(&env);

    let info = client.info();
    assert_eq!(info.owner, owner);
    assert_eq!(info.payto, payto);
    assert_eq!(info.name, String::from_str(&env, "summarize.fn"));
    assert_eq!(info.registered_at, info.updated_at);
}

#[test]
fn payto_and_owner_shortcuts_match_info() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, owner, payto) = deploy(&env);

    assert_eq!(client.payto(), payto);
    assert_eq!(client.owner(), owner);
}

#[test]
fn update_changes_fields_but_never_payto() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, _, payto) = deploy(&env);

    env.ledger().set_timestamp(env.ledger().timestamp() + 60);

    let renamed = String::from_str(&env, "summarize.fn v2");
    let (_, endpoint, description, tags) = details(&env);
    client.update(&renamed, &endpoint, &description, &tags);

    let info = client.info();
    assert_eq!(info.name, renamed);
    assert_eq!(info.payto, payto, "payto must survive an update");
    assert!(info.updated_at > info.registered_at);
}

#[test]
fn transfer_owner_moves_control_but_not_the_payment_address() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, owner, payto) = deploy(&env);
    let next = Address::generate(&env);

    client.transfer_owner(&next);

    let info = client.info();
    assert_eq!(info.owner, next);
    assert_ne!(info.owner, owner);
    assert_eq!(info.payto, payto, "reputation stays with the payment address");
}

#[test]
fn oversized_fields_are_rejected_on_update() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, _, _) = deploy(&env);
    let (_, endpoint, description, tags) = details(&env);

    let long = String::from_str(&env, "x".repeat(65).as_str());
    assert_eq!(
        client.try_update(&long, &endpoint, &description, &tags),
        Err(Ok(Error::NameTooLong))
    );

    let mut many = Vec::new(&env);
    for _ in 0..9 {
        many.push_back(String::from_str(&env, "tag"));
    }
    let (name, _, _, _) = details(&env);
    assert_eq!(
        client.try_update(&name, &endpoint, &description, &many),
        Err(Ok(Error::TooManyTags))
    );
}

#[test]
fn empty_name_is_rejected() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, _, _) = deploy(&env);
    let (_, endpoint, description, tags) = details(&env);

    assert_eq!(
        client.try_update(&String::from_str(&env, ""), &endpoint, &description, &tags),
        Err(Ok(Error::NameEmpty))
    );
}

#[test]
#[should_panic]
fn constructor_rejects_invalid_details() {
    let env = Env::default();
    env.mock_all_auths();
    let (_, endpoint, description, tags) = details(&env);
    env.register(
        Agent,
        (
            Address::generate(&env),
            Address::generate(&env),
            String::from_str(&env, ""),
            endpoint,
            description,
            tags,
        ),
    );
}
