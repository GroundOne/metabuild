use near_contract_standards::non_fungible_token::metadata::NFTContractMetadata;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
#[allow(non_snake_case)] // TODO rename fields when rust part contract is set up
pub struct InitializeArgs {
    pub ownerId: String,
    pub projectName: String,
    pub totalSupply: U128,
    pub price: U128,
    pub metadata: NFTContractMetadata,
    pub reservedTokenIds: Option<Vec<String>>,
    pub reservedTokenOwner: String,
    pub prelaunchEnd: Option<String>,
    pub saleEnd: Option<String>,
}

// pub struct JsonPartToken {
//     pub token_id: String,
//     pub owner_id: String,
//     pub metadata: TokenMetadata,
//     pub approved_account_ids: HashMap<String, U64>,
// }
