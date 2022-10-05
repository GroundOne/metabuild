import { assert, near } from "near-sdk-js"
import { Contract, NFT_METADATA_SPEC, NFT_STANDARD_NAME } from "."
import {
  internalAddPVTTokenToOwner,
  internalAddTokenToOwner,
  internalNextPVTTokenId,
  internalNextTokenId,
  refundDeposit,
} from "./internal"
import { Token, TokenMetadata } from "./metadata"
import { MintPVTArgs } from "./types"

export function internalMint({
  contract,
  metadata,
  receiver_id,
  tokenId,
}: {
  contract: Contract
  metadata: TokenMetadata
  receiver_id: string
  tokenId?: string
}): void {
  //measure the initial storage being used on the contract TODO
  let initialStorageUsage = near.storageUsage()

  //specify the token struct that contains the owner ID
  let token = new Token({
    //set the owner ID equal to the receiver ID passed into the function
    ownerId: receiver_id,
    //we set the approved account IDs to the default value (an empty map)
    approvedAccountIds: {},
    //the next approval ID is set to 0
    nextApprovalId: 0,
  })

  const newTokenId = tokenId || contract.currentTokenId.toString()
  // assert(
  //   contract.totalSupply > +newTokenId,
  //   `Total supply reached ${contract.totalSupply}`
  // )

  metadata.description =
    `${metadata.description ? `${metadata.description}\n` : ""}` +
    `Token Id ${newTokenId}`

  //insert the token ID and token struct and make sure that the token doesn't exist
  assert(!contract.tokensById.containsKey(newTokenId), "Token already exists")
  contract.tokensById.set(newTokenId, token)

  //insert the token ID and metadata
  contract.tokenMetadataById.set(newTokenId, metadata)

  //call the internal method for adding the token to the owner
  internalAddTokenToOwner(contract, token.owner_id, newTokenId)

  // increase currentTokenId
  if (!tokenId) {
    const newCurrentTokenId = internalNextTokenId({ contract })
    contract.currentTokenId = newCurrentTokenId
  }

  // Construct the mint log as per the events standard.
  let nftMintLog = {
    standard: NFT_STANDARD_NAME,
    version: NFT_METADATA_SPEC,
    event: "nft_mint",
    data: [{ owner_id: token.owner_id, token_ids: [newTokenId] }],
  }

  near.log(`EVENT_JSON:${JSON.stringify(nftMintLog)}`)

  //calculate the required storage which was the used - initial TODO
  let requiredStorageInBytes =
    near.storageUsage().valueOf() - initialStorageUsage.valueOf()

  //refund any excess storage if the user attached too much. Panic if they didn't attach enough to cover the required.
  refundDeposit(requiredStorageInBytes)
}

export function internalPVTMint({
  contract,
  tokenId,
  metadata,
  receiver_id,
}: MintPVTArgs & { contract: Contract }): void {
  //measure the initial storage being used on the contract TODO
  let initialStorageUsage = near.storageUsage()

  //specify the token struct that contains the owner ID
  let token = new Token({
    //set the owner ID equal to the receiver ID passed into the function
    ownerId: receiver_id,
    //we set the approved account IDs to the default value (an empty map)
    approvedAccountIds: {},
    //the next approval ID is set to 0
    nextApprovalId: 0,
  })

  const newTokenId = tokenId || contract.pvtCurrentTokenId.toString()
  assert(
    contract.pvtTotalSupply >= +newTokenId,
    `Total supply reached ${contract.pvtTotalSupply}`
  )

  metadata.description = `${
    metadata.description ? `${metadata.description}\n` : ""
  }Token Id ${newTokenId}`

  //insert the token ID and token struct and make sure that the token doesn't exist
  assert(
    !contract.pvtTokensById.containsKey(newTokenId),
    "Token already exists"
  )
  contract.pvtTokensById.set(newTokenId, token)

  //insert the token ID and metadata
  contract.pvtTokenMetadataById.set(newTokenId, metadata)

  //call the internal method for adding the token to the owner
  internalAddPVTTokenToOwner(contract, token.owner_id, newTokenId)

  // increase pvtCurrentTokenId
  if (!tokenId) {
    const newCurrentTokenId = internalNextPVTTokenId({ contract })
    contract.pvtCurrentTokenId = newCurrentTokenId
  }

  // Construct the mint log as per the events standard.
  let nftMintLog = {
    standard: NFT_STANDARD_NAME,
    version: NFT_METADATA_SPEC,
    event: "nft_mint_vt",
    data: [{ owner_id: token.owner_id, token_ids: [newTokenId] }],
  }

  near.log(`EVENT_JSON:${JSON.stringify(nftMintLog)}`)

  //calculate the required storage which was the used - initial TODO
  let requiredStorageInBytes =
    near.storageUsage().valueOf() - initialStorageUsage.valueOf()

  //refund any excess storage if the user attached too much. Panic if they didn't attach enough to cover the required.
  refundDeposit(requiredStorageInBytes)
}
