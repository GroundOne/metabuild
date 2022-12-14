use crate::*;
use near_sdk::{json_types::U128, near_bindgen};

#[near_bindgen]
impl PartTokenFactory {
    pub fn get_number_of_tokens(&self) -> u64 {
        self.contracts.len()
    }

    pub fn get_contracts(
        &self,
        from_index: Option<u64>,
        limit: Option<u64>,
    ) -> Vec<InitializeArgs> {
        let from = from_index.unwrap_or(0);
        let until = limit.unwrap_or_else(|| self.get_number_of_tokens());

        let tokens = self.contracts.values_as_vector();
        (from..std::cmp::min(from + until, tokens.len()))
            .filter_map(|index| tokens.get(index))
            .collect()
    }

    pub fn get_contract(&self, token_id: TokenId) -> Option<InitializeArgs> {
        self.contracts.get(&token_id)
    }

    pub fn supply_for_owner(&self, account_id: AccountId) -> U128 {
        let contracts_for_owner_set = self.contracts_per_owner.get(&account_id);

        //if there is some set of tokens, we'll return the length as a U128
        if let Some(contracts_for_owner_set) = contracts_for_owner_set {
            U128(contracts_for_owner_set.len() as u128)
        } else {
            //if there isn't a set of tokens for the passed in account ID, we'll return 0
            U128(0)
        }
    }

    pub fn contracts_for_owner(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<AccountId> {
        //get the set of tokens for the passed in owner
        let contracts_for_owner_set = self.contracts_per_owner.get(&account_id);

        //if there is some set of tokens, we'll set the tokens variable equal to that set
        let tokens = if let Some(contracts_for_owner_set) = contracts_for_owner_set {
            contracts_for_owner_set
        } else {
            //if there is no set of tokens, we'll simply return an empty vector.
            return vec![];
        };

        //where to start pagination - if we have a from_index, we'll use that - otherwise start from 0 index
        let start = u128::from(from_index.unwrap_or(U128(0)));

        //iterate through the keys vector
        tokens
            .iter()
            .skip(start as usize)
            .take(limit.unwrap_or(50) as usize)
            .cloned()
            .collect()
    }

    // #[private] // Public - but only callable by env::current_account_id()
    // pub fn query_nft_tokens_for_owner_callback(
    //     &self,
    //     #[callback_result] call_result: Result<Vec<JsonPartToken>, PromiseError>,
    // ) -> Vec<JsonPartToken> {
    //     // Check if the promise succeeded by calling the method outlined in external.rs
    //     if call_result.is_err() {
    //         log!("There was an error contacting a Part Token Contract");
    //         return vec![];
    //     }

    //     // Return the greeting
    //     let tokens: Vec<JsonPartToken> = call_result.unwrap();
    //     tokens
    // }

    // pub fn query_nft_tokens_for_owner(&mut self, account_id: AccountId) -> Promise {
    //     let all_contracts: Vec<TokenId> = self.contracts.keys().collect();

    //     for contract in &all_contracts {
    //         let contract_id = AccountId::new_unchecked(contract);

    //         part_token_ext::ext(contract_id.clone())
    //             .with_static_gas(Gas(5 * 1_000_000_000_000))
    //             .query_nft_tokens_for_owner(contract_id)
    //             .then(
    //                 // Create a callback query_nft_tokens_for_owner_callback
    //                 Self::ext(env::current_account_id())
    //                     .with_static_gas(Gas(5 * 1_000_000_000_000))
    //                     .query_nft_tokens_for_owner_callback(),
    //             )
    //     }
    // }
}
