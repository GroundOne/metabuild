use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap};
use near_sdk::env::STORAGE_PRICE_PER_BYTE;
use near_sdk::json_types::U128;
use near_sdk::{env, near_bindgen, AccountId, Balance, BorshStorageKey, PanicOnDefault, Promise};

use part::{is_valid_token_id, InitializeArgs, TokenId};

mod part;

const FT_WASM_CODE: &[u8] = include_bytes!("../../build/part.wasm");

const EXTRA_BYTES: usize = 10000;
// const GAS: Gas = Gas(50_000_000_000_000);

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    Tokens,
    StorageDeposits,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct PartTokenFactory {
    // TODO: rename tokens into contracts
    pub tokens: UnorderedMap<TokenId, InitializeArgs>,
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
            storage_deposits,
            storage_balance_cost,
        }
    }

    #[payable]
    pub fn storage_deposit(&mut self) {
        let account_id = env::predecessor_account_id();
        let deposit = env::attached_deposit();
        if let Some(previous_balance) = self.storage_deposits.get(&account_id) {
            self.storage_deposits
                .insert(&account_id, &(previous_balance + deposit));
        } else {
            assert!(deposit >= self.storage_balance_cost, "Deposit is too low");
            self.storage_deposits
                .insert(&account_id, &(deposit - self.storage_balance_cost));
        }
    }

    #[payable]
    pub fn create_token(&mut self, args: InitializeArgs) -> Promise {
        if env::attached_deposit() > 0 {
            self.storage_deposit();
        }

        args.metadata.assert_valid();

        let token_id = args.projectName.replace(" ", "_").to_ascii_lowercase();
        assert!(
            is_valid_token_id(&token_id),
            "Invalid Symbol, only ascii letters, numbers, space and _ allowed, is {}",
            token_id
        );

        let token_account_id =
            AccountId::new_unchecked(format!("{}.{}", token_id, env::current_account_id()));
        assert!(
            env::is_valid_account_id(token_account_id.as_bytes()),
            "Token Account ID is invalid, please simplify project name, cannot create {}",
            token_account_id
        );

        let account_id = env::predecessor_account_id();

        let required_balance = self.get_min_attached_balance(&args);
        let user_balance = self.storage_deposits.get(&account_id).unwrap_or(0);
        assert!(
            user_balance >= required_balance,
            "Not enough required balance, need {} is {}",
            required_balance,
            user_balance
        );
        self.storage_deposits
            .insert(&account_id, &(user_balance - required_balance));

        let initial_storage_usage = env::storage_usage();

        assert!(
            self.tokens.insert(&token_id, &args).is_none(),
            "Token ID is already taken"
        );

        let storage_balance_used =
            Balance::from(env::storage_usage() - initial_storage_usage) * STORAGE_PRICE_PER_BYTE;

        Promise::new(token_account_id)
            .create_account()
            .transfer(required_balance - storage_balance_used)
            .deploy_contract(FT_WASM_CODE.to_vec())
            .add_full_access_key(env::signer_account_pk()) // TODO give function-call access key to this factory?
    }

    pub fn get_required_deposit(&self, args: InitializeArgs, account_id: AccountId) -> U128 {
        let args_deposit = self.get_min_attached_balance(&args);
        if let Some(previous_balance) = self.storage_deposits.get(&account_id) {
            args_deposit.saturating_sub(previous_balance).into()
        } else {
            (self.storage_balance_cost + args_deposit).into()
        }
    }

    pub fn get_number_of_tokens(&self) -> u64 {
        self.tokens.len()
    }

    pub fn get_tokens(&self, from_index: Option<u64>, limit: Option<u64>) -> Vec<InitializeArgs> {
        let from = from_index.unwrap_or(0);
        let until = limit.unwrap_or(self.get_number_of_tokens());

        let tokens = self.tokens.values_as_vector();
        (from..std::cmp::min(from + until, tokens.len()))
            .filter_map(|index| tokens.get(index))
            .collect()
    }

    pub fn get_token(&self, token_id: TokenId) -> Option<InitializeArgs> {
        self.tokens.get(&token_id)
    }

    fn get_min_attached_balance(&self, args: &InitializeArgs) -> u128 {
        (FT_WASM_CODE.len() + EXTRA_BYTES + args.try_to_vec().unwrap().len() * 2) as Balance
            * STORAGE_PRICE_PER_BYTE
    }
}
