use near_contract_standards::non_fungible_token::metadata::NFTContractMetadata;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
#[allow(non_snake_case)] // TODO rename fields when rust part contract is set up
pub struct InitializeArgs {
    pub projectAddress: String, // will be subaccount name of factory
    pub projectName: String,
    pub ownerId: String,
    pub totalSupply: u128,
    pub price: String, // yoctoNear
    pub metadata: NFTContractMetadata,
    pub reservedTokenIds: Option<Vec<String>>,
    pub saleOpening: Option<String>,
    pub saleClose: Option<String>,
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, Debug)]
#[serde(crate = "near_sdk::serde")]
#[allow(non_snake_case)] // TODO rename fields when rust part contract is set up
pub struct DeployArgs {
    pub projectName: String,
    pub ownerId: String,
    pub totalSupply: u128,
    pub price: String, // yoctoNear
    pub metadata: NFTContractMetadata,
    pub reservedTokenIds: Option<Vec<String>>,
    pub saleOpening: Option<String>,
    pub saleClose: Option<String>,
}

impl DeployArgs {
    pub fn from_init_args(args: InitializeArgs) -> Self {
        DeployArgs {
            projectName: args.projectName,
            ownerId: args.ownerId,
            totalSupply: args.totalSupply,
            price: args.price,
            metadata: args.metadata,
            reservedTokenIds: args.reservedTokenIds,
            saleOpening: args.saleOpening,
            saleClose: args.saleClose,
        }
    }
}

// pub struct JsonPartToken {
//     pub token_id: String,
//     pub owner_id: String,
//     pub metadata: TokenMetadata,
//     pub approved_account_ids: HashMap<String, U64>,
// }
