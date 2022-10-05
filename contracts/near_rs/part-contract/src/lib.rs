use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::{Base64VecU8, I128, U128};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near_bindgen, AccountId, Balance, CryptoHash, PanicOnDefault, Promise, PromiseOrValue,
};
use std::collections::HashMap;

pub use crate::approval::*;
pub use crate::events::*;
use crate::internal::*;
pub use crate::metadata::*;
pub use crate::mint::*;
pub use crate::nft_core::*;
pub use crate::royalty::*;

mod approval;
mod enumeration;
mod events;
mod internal;
mod metadata;
mod mint;
mod nft_core;
mod royalty;

/// This spec can be treated like a version of the standard.
pub const NFT_METADATA_SPEC: &str = "nft-1.0.0";
/// This is the name of the NFT standard we're using
pub const NFT_STANDARD_NAME: &str = "nep171";

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    //contract owner
    pub owner_id: AccountId,
    pub project_name: String,

    // Part Metrics
    pub current_token_id: i32, // start token IDs with `1`
    pub total_supply: I128,    // max. number of tokens to be minted
    pub price: I128,           // price for buyers to deposit per token
    pub prelaunch_end: u64,    // blockTimestamp when regular sales starts
    pub sale_end: u64,         // blockTimestamp when sale has finished

    //keeps track of all the token IDs for a given account
    pub tokens_per_owner: LookupMap<AccountId, UnorderedSet<TokenId>>,
    //keeps track of the token struct for a given token ID
    pub tokens_by_id: LookupMap<TokenId, Token>,
    //keeps track of the token metadata for a given token ID
    pub token_metadata_by_id: UnorderedMap<TokenId, TokenMetadata>,
    //keeps track of the metadata for the contract
    pub metadata: LazyOption<NFTContractMetadata>,
}

/// Helper structure for keys of the persistent collections.
#[derive(BorshSerialize)]
pub enum StorageKey {
    TokensPerOwner,
    TokenPerOwnerInner { account_id_hash: CryptoHash },
    TokensById,
    TokenMetadataById,
    NFTContractMetadata,
    TokensPerType,
    TokensPerTypeInner { token_type_hash: CryptoHash },
    TokenTypesLocked,
}

#[near_bindgen]
impl Contract {
    /*
        initialization function (can only be called once).
        this initializes the contract with default metadata so the
        user doesn't have to manually type metadata.
    */
    #[init]
    pub fn new_default_meta(owner_id: AccountId, total_supply: I128, price: I128) -> Self {
        let project_name = String::from("GroundOne Part");

        let now = env::block_timestamp();
        let three_minutes = 3 * 60 + 1_000_000_000;

        let prelaunch_end: u64 = now + three_minutes;
        let sale_end: u64 = now + 2 * three_minutes;

        //calls the other function "new: with some default metadata and the owner_id passed in
        Self::new(
            owner_id,
            project_name,
            total_supply,
            price,
            Some(prelaunch_end),
            Some(sale_end),
            NFTContractMetadata {
                spec: "nft-1.0.0".to_string(),
                name: "GroundOne PART".to_string(),
                symbol: "GOPART".to_string(),
                icon: None,
                base_uri: None,
                reference: None,
                reference_hash: None,
            },
        )
    }

    /*
        initialization function (can only be called once).
        this initializes the contract with metadata that was passed in and
        the owner_id.
    */
    #[init]
    pub fn new(
        owner_id: AccountId,
        project_name: String,
        total_supply: I128,
        price: I128,
        prelaunch_end: Option<u64>,
        sale_end: Option<u64>,
        metadata: NFTContractMetadata,
    ) -> Self {
        //create a variable of type Self with all the fields initialized.

        let current_token_id = 1;

        let this = Self {
            //Storage keys are simply the prefixes used for the collections. This helps avoid data collision
            tokens_per_owner: LookupMap::new(StorageKey::TokensPerOwner.try_to_vec().unwrap()),
            tokens_by_id: LookupMap::new(StorageKey::TokensById.try_to_vec().unwrap()),
            token_metadata_by_id: UnorderedMap::new(
                StorageKey::TokenMetadataById.try_to_vec().unwrap(),
            ),
            //set the owner_id field equal to the passed in owner_id.
            owner_id,
            project_name,
            current_token_id,
            total_supply,
            price,
            prelaunch_end: prelaunch_end.unwrap(),
            sale_end: sale_end.unwrap(),
            metadata: LazyOption::new(
                StorageKey::NFTContractMetadata.try_to_vec().unwrap(),
                Some(&metadata),
            ),
        };

        //return the Contract object
        this
    }
}

#[cfg(test)]
mod tests;
