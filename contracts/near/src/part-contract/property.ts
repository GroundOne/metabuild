import { assert, near } from "near-sdk-js"
import { internalNftTokens } from "./enumeration"
import { Contract } from "./index"
import { restoreOwners } from "./internal"
import { InitializePropertiesArgs } from "./types"

export class Property {
  id: string
  link: string

  constructor({ id, link }: { id: string; link: string }) {
    this.id = id
    this.link = link
  }
}

export function internalInitProperties(
  initArgs: InitializePropertiesArgs & { contract: Contract }
) {
  const contract = initArgs.contract

  assert(
    near.signerAccountId() === contract.ownerId,
    `Only owner can distribute after presale`
  )

  assert(
    contract.saleClose < contract.distributionStart,
    `Distribution should happen before sale end. Distribution start is ${contract.distributionStart}, sale end ${contract.saleClose}`
  )

  if (contract.distributionStart)
    contract.distributionStart = BigInt(initArgs.distributionStart)

  if (initArgs.totalSupply && initArgs.reservedTokenIds) {
    assert(
      initArgs.totalSupply >
        Math.max.apply(initArgs.reservedTokenIds.map((t) => +t)),
      `Amount of properties must be greater than highest reserved property ID. Amount of properties ${initArgs.totalSupply}, reserved properties: ${initArgs.reservedTokenIds}`
    )
  }

  initArgs.totalSupply
  const propertyIds = new Array(initArgs.totalSupply)
    .fill(null)
    .map((_, i) => (i + 1).toString())
  near.log(
    `Following properties will be created: ${JSON.stringify(propertyIds)}`
  )

  propertyIds.forEach((propertyId) => {
    contract.properties.set(
      propertyId,
      new Property({ id: propertyId, link: "" })
    )
  })

  if (initArgs.reservedTokenIds) {
    const reservedTokenIds = initArgs.reservedTokenIds
    near.log(
      `Following Property IDs will be reserved: ${JSON.stringify(
        reservedTokenIds
      )}`
    )

    reservedTokenIds.forEach((reservedTokenId) => {
      contract.reservedProperties.push(reservedTokenId.toString())
    })
  }
}

//Query for nft tokens on the contract regardless of the owner using pagination
export function internalPropertiesInfo({
  contract,
  fromIndex,
  limit,
}: {
  contract: Contract
  fromIndex?: string
  limit?: number
}): Property[] {
  let properties = []

  //where to start pagination - if we have a fromIndex, we'll use that - otherwise start from 0 index
  let start = fromIndex ? parseInt(fromIndex) : 0
  //take the first "limit" elements in the array. If we didn't specify a limit, use 50
  let max = limit ? limit : 50

  let keys = contract.properties.toArray()

  // Paginate through the keys using the fromIndex and limit
  for (let i = start; i < keys.length && i < start + max; i++) {
    // get the token object from the keys
    let property = new Property({
      id: keys[i][0],
      link: "",
    })
    properties.push(property)
  }
  return properties
}

//get the information for a specific token ID
export function internalPropertyInfo({
  contract,
  id,
}: {
  contract: Contract
  id: string
}) {
  let property = contract.properties.get(id) as Property
  //if there wasn't a token ID in the tokens_by_id collection, we return None
  if (property == null) {
    return null
  }

  return property
}

// export function internalEditProperties({
//   contract,
//   propertyData,
// }: EditPropertiesArgs & { contract: Contract }): void {
//   assert(near.signerAccountId() === contract.ownerId, `Only owner can add property`)

//   //measure the initial storage being used on the contract TODO
//   let initialStorageUsage = near.storageUsage()

//   //specify the token struct that contains the owner ID
//   let property = new Property(propertyData)

//   assert(
//     !contract.properties.keys().toArray().includes(property.id),
//     "Token already exists"
//   )
//   //insert the token ID and token struct and override if it already exist
//   contract.properties.set(property.id, property)

//   near.log(`Added property: ${property.id}`)

//   //calculate the required storage which was the used - initial TODO
//   let requiredStorageInBytes =
//     near.storageUsage().valueOf() - initialStorageUsage.valueOf()

//   //refund any excess storage if the user attached too much. Panic if they didn't attach enough to cover the required.
//   refundDeposit(requiredStorageInBytes)
// }

export class PropertyPreference {
  constructor(
    public propertyPreferenceIds: string[],
    public isPreferenceServed: boolean = false
  ) {
    this.propertyPreferenceIds = propertyPreferenceIds
    this.isPreferenceServed = isPreferenceServed
  }
}

export function internalSetPropertyPreferences({
  propertyPreferenceIds,
  contract,
}: {
  propertyPreferenceIds: string[]
  contract: Contract
}) {
  let tokens = restoreOwners(
    contract.tokensPerOwner.get(near.currentAccountId())
  )
  assert(
    tokens.length == 1,
    `Current account doesn't own any PART Tokens ${near.currentAccountId()}`
  )

  contract.propertyPreferenceByTokenId.set(
    near.currentAccountId(),
    new PropertyPreference(propertyPreferenceIds)
  )
}

export function internalDistributeProperties({
  contract,
}: {
  contract: Contract
}) {
  const partTokens = internalNftTokens({ contract })

  // loop through all token holders
  for (const partToken of partTokens) {
    const propertyPreference = contract.propertyPreferenceByTokenId.get(
      partToken.token_id
    ) as PropertyPreference | null

    if (
      !propertyPreference ||
      propertyPreference.propertyPreferenceIds?.length === 0
    ) {
      continue
    }

    // loop through all preferences until unoccupied property found
    for (const preference of propertyPreference.propertyPreferenceIds) {
      const isOccupied = contract.tokenIdByProperty.get(preference)

      if (!isOccupied) {
        contract.tokenIdByProperty.set(preference, partToken.token_id)
        propertyPreference.isPreferenceServed = true
        break
      }
    }

    near.log(
      `No preference were unoccupied for token id: ${partToken.token_id}`
    )
  }
}
