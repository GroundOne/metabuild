// use near_sdk::{ext_contract, AccountId};

// use crate::part::JsonPartToken;

// // Interface of this contract, for callbacks
// #[ext_contract(this_contract)]
// trait Callbacks {
//     fn query_nft_tokens_for_owner_callback(&mut self) -> Vec<JsonPartToken>;
// }

// // Validator interface, for cross-contract calls
// #[ext_contract(part_token_ext)]
// trait PartTokenExt {
//     fn query_nft_tokens_for_owner(&self, account_id: AccountId) -> String;
// }
