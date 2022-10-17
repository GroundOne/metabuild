// use crate::{PartTokenFactory, FT_WASM_CODE, EXTRA_BYTES};
// use crate::part::InitializeArgs;
use crate::*;
use near_sdk::env::STORAGE_PRICE_PER_BYTE;
use near_sdk::json_types::U128;
use near_sdk::{env, near_bindgen, AccountId, Balance};

#[near_bindgen]
impl PartTokenFactory {
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

    pub fn get_required_deposit(&self, args: InitializeArgs, account_id: AccountId) -> U128 {
        let args_deposit = self.get_min_attached_balance(&args);
        if let Some(previous_balance) = self.storage_deposits.get(&account_id) {
            args_deposit.saturating_sub(previous_balance).into()
        } else {
            (self.storage_balance_cost + args_deposit).into()
        }
    }

    pub(crate) fn get_min_attached_balance(&self, args: &InitializeArgs) -> u128 {
        (FT_WASM_CODE.len() + EXTRA_BYTES + args.try_to_vec().unwrap().len() * 2) as Balance
            * STORAGE_PRICE_PER_BYTE
    }
}
