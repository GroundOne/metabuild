use crate::part::DeployArgs;
use crate::*;
use near_sdk::env::STORAGE_PRICE_PER_BYTE;
use near_sdk::serde_json;
use near_sdk::{env, near_bindgen, AccountId, Balance, Gas, Promise, PublicKey};

use std::str::FromStr;

pub type TokenId = String;

#[near_bindgen]
impl PartTokenFactory {
    #[payable]
    pub fn create_token(&mut self, args: InitializeArgs) -> Promise {
        if env::attached_deposit() > 0 {
            self.storage_deposit(None);
        }

        args.metadata.assert_valid();

        let token_id = args.projectAddress.replace(' ', "_").to_ascii_lowercase();
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
            self.contracts.insert(&token_id, &args).is_none(),
            "Token ID is already taken, {}",
            token_id
        );

        match self.contracts_per_owner.get(&env::signer_account_id()) {
            None => {
                self.contracts_per_owner
                    .insert(&env::signer_account_id(), &vec![token_account_id.clone()]);
            }
            Some(mut current_tokens) => {
                current_tokens.push(token_account_id.clone());

                self.contracts_per_owner
                    .insert(&env::signer_account_id(), &current_tokens);
            }
        }

        let storage_balance_used =
            Balance::from(env::storage_usage() - initial_storage_usage) * STORAGE_PRICE_PER_BYTE;

        let groundone_testnet_pub_key = "ed25519:CUPhDiAZiJyEz94SczyWXfpWdHrLL4BW94Ei8aRx1wJB";

        let deploy_args = DeployArgs::from_init_args(args);
        let deploy_deposit = 15 * (1e21 as u128);
        let deploy_gas = Gas(200 * (1e12 as u64));

        Promise::new(token_account_id)
            .create_account()
            .transfer(
                env::attached_deposit() + required_balance - storage_balance_used - deploy_deposit,
            )
            .add_full_access_key(env::signer_account_pk())
            // TODO Remove on production
            .add_full_access_key(PublicKey::from_str(groundone_testnet_pub_key).unwrap())
            //
            .deploy_contract(PART_TOKEN_WASM_CODE.to_vec())
            .function_call(
                "init".to_owned(),
                serde_json::to_vec(&deploy_args).unwrap(),
                deploy_deposit,
                deploy_gas,
            )
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
