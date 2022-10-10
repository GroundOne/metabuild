import { assert, near } from "near-sdk-js"
import { Contract } from "./index"
import { refundDeposit } from "./internal"
import { JsonToken } from "./metadata"
import { AddPVTArgs, InitializePVTArgs } from "./types"

export function internalInitPVT(
  initArgs: InitializePVTArgs & { contract: Contract }
) {
  const contract = initArgs.contract

  assert(
    near.signerAccountId() === contract.ownerId,
    `Only owner can distribute after presale`
  )

  assert(
    contract.saleEnd < contract.pvtDistributionStart,
    `Distribution should happen before sale end. Distribution start is ${contract.pvtDistributionStart}, sale end ${contract.saleEnd}`
  )

  if (contract.pvtDistributionStart)
    contract.pvtDistributionStart = initArgs.distributionStart

  if (initArgs.totalSupply && initArgs.reservedTokenIds) {
    assert(
      initArgs.totalSupply >
        Math.max.apply(initArgs.reservedTokenIds.map((t) => +t)),
      `Amount of PVTs must be greater than highest reserved pvt. Amount of PVTs ${initArgs.totalSupply}, reserved pvts: ${initArgs.reservedTokenIds}`
    )
  }

  if (initArgs.totalSupply) {
    const pvtIds = new Array(initArgs.totalSupply)
      .fill(null)
      .map((_, i) => i + 1)
    near.log(`Following PVTs will be created: ${JSON.stringify(pvtIds)}`)

    pvtIds.forEach((pvtId) => {
      contract.pvts.set(
        pvtId.toString(),
        new PVT({ id: pvtId.toString(), link: "" })
      )
    })
  }

  if (initArgs.reservedTokenIds) {
    const reservedTokenIds = initArgs.reservedTokenIds
    near.log(
      `Following PVT Tokens will be reserved: ${JSON.stringify(
        reservedTokenIds
      )}`
    )

    reservedTokenIds.forEach((reservedTokenId) => {
      contract.reservedPvts.push(reservedTokenId.toString())
    })
  }
}

// export function internalEditPVT({
//   contract,
//   pvtData,
// }: AddPVTArgs & { contract: Contract }): void {
//   assert(near.signerAccountId() === contract.ownerId, `Only owner can add pvt`)

//   //measure the initial storage being used on the contract TODO
//   let initialStorageUsage = near.storageUsage()

//   //specify the token struct that contains the owner ID
//   let pvt = new PVT(pvtData)

//   assert(
//     !contract.pvts.keys().toArray().includes(pvt.id),
//     "Token already exists"
//   )
//   //insert the token ID and token struct and override if it already exist
//   contract.pvts.set(pvt.id, pvt)

//   near.log(`Added PVT: ${pvt.id}`)

//   //calculate the required storage which was the used - initial TODO
//   let requiredStorageInBytes =
//     near.storageUsage().valueOf() - initialStorageUsage.valueOf()

//   //refund any excess storage if the user attached too much. Panic if they didn't attach enough to cover the required.
//   refundDeposit(requiredStorageInBytes)
// }

export class PVT {
  id: string
  link: string

  constructor({ id, link }: { id: string; link: string }) {
    this.id = id
    this.link = link
  }
}

// export function internalAddPVTTokenToOwner(
//   contract: Contract,
//   accountId: string,
//   tokenId: string
// ) {
//   //get the set of tokens for the given account
//   let tokenSet = restoreOwners(contract.pvtTokensPerOwner.get(accountId))

//   if (tokenSet == null) {
//     //if the account doesn't have any tokens, we create a new unordered set
//     tokenSet = new UnorderedSet("pvtTokensPerOwner" + accountId.toString())
//   }

//   //we insert the token ID into the set
//   tokenSet.set(tokenId)

//   //we insert that set for the given account ID.
//   contract.pvtTokensPerOwner.set(accountId, tokenSet)
// }

// export function internalNextPVTTokenId({ contract }: { contract: Contract }) {
//   let currentTokenId = contract.pvtCurrentTokenId + 1

//   while (contract.pvtTokensById.containsKey(currentTokenId.toString())) {
//     currentTokenId += 1

//     if (contract.pvtTotalSupply < currentTokenId) break
//   }

//   near.log(`New Current Token Id: ${currentTokenId}`)
//   return currentTokenId
// }

//Query for nft tokens on the contract regardless of the owner using pagination
export function internalNftPVTTokens({
  contract,
  fromIndex,
  limit,
}: {
  contract: Contract
  fromIndex?: string
  limit?: number
}): PVT[] {
  let pvts = []

  //where to start pagination - if we have a fromIndex, we'll use that - otherwise start from 0 index
  let start = fromIndex ? parseInt(fromIndex) : 0
  //take the first "limit" elements in the array. If we didn't specify a limit, use 50
  let max = limit ? limit : 50

  let keys = contract.pvts.toArray()

  // Paginate through the keys using the fromIndex and limit
  for (let i = start; i < keys.length && i < start + max; i++) {
    // get the token object from the keys
    let pvt = new PVT({
      id: keys[i][0],
      link: "",
    })
    pvts.push(pvt)
  }
  return pvts
}

//get the total supply of NFTs for a given owner
// export function internalPVTSupplyForOwner({
//   contract,
//   accountId,
// }: {
//   contract: Contract
//   accountId: string
// }): number {
//   //get the set of tokens for the passed in owner
//   let tokens = restoreOwners(contract.pvtTokensPerOwner.get(accountId))
//   //if there isn't a set of tokens for the passed in account ID, we'll return 0
//   if (tokens == null) {
//     return 0
//   }

//   //if there is some set of tokens, we'll return the length
//   return tokens.length
// }

//Query for all the tokens for an owner
// export function internalTokenPVTsForOwner({
//   contract,
//   accountId,
//   fromIndex,
//   limit,
// }: {
//   contract: Contract
//   accountId: string
//   fromIndex?: string
//   limit?: number
// }): JsonToken[] {
//   //get the set of tokens for the passed in owner
//   let tokenSet = restoreOwners(contract.pvtTokensPerOwner.get(accountId))

//   //if there isn't a set of tokens for the passed in account ID, we'll return 0
//   if (tokenSet == null) {
//     return []
//   }

//   //where to start pagination - if we have a fromIndex, we'll use that - otherwise start from 0 index
//   let start = fromIndex ? parseInt(fromIndex) : 0
//   //take the first "limit" elements in the array. If we didn't specify a limit, use 50
//   let max = limit ? limit : 50

//   let keys = tokenSet.toArray()
//   let tokens: JsonToken[] = []
//   for (let i = start; i < max; i++) {
//     if (i >= keys.length) {
//       break
//     }
//     let token = internalNftPVTToken({ contract, tokenId: keys[i] })
//     tokens.push(token)
//   }
//   return tokens
// }
