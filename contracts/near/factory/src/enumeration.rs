use crate::*;
use near_sdk::near_bindgen;

#[near_bindgen]
impl PartTokenFactory {
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
}
