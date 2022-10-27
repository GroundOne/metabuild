use near_contract_standards::non_fungible_token::metadata::NFTContractMetadata;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
#[allow(non_snake_case)] // TODO rename fields when rust part contract is set up
pub struct InitializeArgs {
    pub projectName: String,
    pub metadata: NFTContractMetadata,
}

// pub struct JsonPartToken {
//     pub token_id: String,
//     pub owner_id: String,
//     pub metadata: TokenMetadata,
//     pub approved_account_ids: HashMap<String, U64>,
// }
