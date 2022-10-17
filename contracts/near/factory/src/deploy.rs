use crate::*;
use near_sdk::env::STORAGE_PRICE_PER_BYTE;
use near_sdk::{env, near_bindgen, AccountId, Balance, Promise};

pub type TokenId = String;

#[near_bindgen]
impl PartTokenFactory {
    #[payable]
    pub fn create_token(&mut self, args: InitializeArgs) -> Promise {
        if env::attached_deposit() > 0 {
            self.storage_deposit();
        }

        args.metadata.assert_valid();

        let token_id = args.projectName.replace(" ", "_").to_ascii_lowercase();
        assert!(
            self.is_valid_token_id(&token_id),
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

    fn is_valid_token_id(&self, token_id: &TokenId) -> bool {
        for c in token_id.as_bytes() {
            match c {
                b'0'..=b'9' | b'a'..=b'z' | b'_' => (),
                _ => return false,
            }
        }
        true
    }
}