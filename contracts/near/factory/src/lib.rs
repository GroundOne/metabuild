use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap};
use near_sdk::env::STORAGE_PRICE_PER_BYTE;
use near_sdk::{env, near_bindgen, AccountId, Balance, BorshStorageKey, PanicOnDefault};

use deploy::TokenId;
use part::InitializeArgs;

mod deploy;
mod enumeration;
mod part;
mod storage;

const FT_WASM_CODE: &[u8] = include_bytes!("../../build/part.wasm");

const EXTRA_BYTES: usize = 10000;

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    Tokens,
    TokensPerOwner,
    StorageDeposits,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct PartTokenFactory {
    pub tokens: UnorderedMap<TokenId, InitializeArgs>,
    pub tokens_per_owner: UnorderedMap<AccountId, Vec<AccountId>>,

    pub storage_deposits: LookupMap<AccountId, Balance>,
    pub storage_balance_cost: Balance,
}

#[near_bindgen]
impl PartTokenFactory {
    #[init]
    pub fn new() -> Self {
        let mut storage_deposits = LookupMap::new(StorageKey::StorageDeposits);

        let initial_storage_usage = env::storage_usage();
        let tmp_account_id = AccountId::new_unchecked("a".repeat(64));
        storage_deposits.insert(&tmp_account_id, &0);
        let storage_balance_cost =
            Balance::from(env::storage_usage() - initial_storage_usage) * STORAGE_PRICE_PER_BYTE;
        storage_deposits.remove(&tmp_account_id);

        Self {
            tokens: UnorderedMap::new(StorageKey::Tokens),
            tokens_per_owner: UnorderedMap::new(StorageKey::TokensPerOwner.try_to_vec().unwrap()),
            storage_deposits,
            storage_balance_cost,
        }
    }
}
