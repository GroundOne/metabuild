use crate::*;
use near_sdk::{json_types::U128, near_bindgen};

#[near_bindgen]
impl PartTokenFactory {
    pub fn get_number_of_tokens(&self) -> u64 {
        self.tokens.len()
    }

    pub fn get_tokens(&self, from_index: Option<u64>, limit: Option<u64>) -> Vec<InitializeArgs> {
        let from = from_index.unwrap_or(0);
        let until = limit.unwrap_or_else(|| self.get_number_of_tokens());

        let tokens = self.tokens.values_as_vector();
        (from..std::cmp::min(from + until, tokens.len()))
            .filter_map(|index| tokens.get(index))
            .collect()
    }

    pub fn get_token(&self, token_id: TokenId) -> Option<InitializeArgs> {
        self.tokens.get(&token_id)
    }

    pub fn supply_for_owner(&self, account_id: AccountId) -> U128 {
        let tokens_for_owner_set = self.tokens_per_owner.get(&account_id);

        //if there is some set of tokens, we'll return the length as a U128
        if let Some(tokens_for_owner_set) = tokens_for_owner_set {
            U128(tokens_for_owner_set.len() as u128)
        } else {
            //if there isn't a set of tokens for the passed in account ID, we'll return 0
            U128(0)
        }
    }

    pub fn tokens_for_owner(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<AccountId> {
        //get the set of tokens for the passed in owner
        let tokens_for_owner_set = self.tokens_per_owner.get(&account_id);

        //if there is some set of tokens, we'll set the tokens variable equal to that set
        let tokens = if let Some(tokens_for_owner_set) = tokens_for_owner_set {
            tokens_for_owner_set
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
}
