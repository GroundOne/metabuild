import { assert, near, Vector } from "near-sdk-js"
import { internalNftTokens } from "./enumeration"
import { Contract, ContractStatusEnum } from "./index"
import { restoreOwners } from "./internal"
import { InitializePropertiesArgs } from "./types"
import { getValuesInVector } from "./utils"

export class Property {
  id: string
  link: string

  constructor({ id, link }: { id: string; link: string }) {
    this.id = id
    this.link = link
  }
}

export class PropertyPreference {
  constructor(
    public propertyPreferenceIds: string[],
    public whichPreferenceIsServed: string = ""
  ) {}
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
    contract.isSaleDone(),
    `Sale has to be finished to initialize properties, currently ${near.blockTimestamp()} is ending ${
      contract.saleClose
    }`
  )

  assert(
    BigInt(contract.saleClose) < BigInt(initArgs.distributionStart),
    `Distribution should happen before sale end. Distribution start is ${contract.distributionStart}, sale end ${contract.saleClose}`
  )
  contract.contractStatus = ContractStatusEnum.PROPERTY_SELECTION

  contract.distributionStart = BigInt(initArgs.distributionStart).toString()

  if (initArgs.reservedTokenIds) {
    assert(
      initArgs.totalSupply >
        Math.max.apply(initArgs.reservedTokenIds.map((t) => +t)),
      `Amount of properties must be greater than highest reserved property Id. Amount of properties ${
        initArgs.totalSupply
      }, reserved properties: ${initArgs.reservedTokenIds.join(", ")}`
    )
  }

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

export function internalSetPropertyPreferences({
  propertyPreferenceIds,
  contract,
}: {
  propertyPreferenceIds: string[]
  contract: Contract
}) {
  const tokenKeys = restoreOwners(
    contract.tokensPerOwner.get(near.signerAccountId())
  ).toArray()

  assert(
    tokenKeys.length === 0,
    `Current account doesn't own any PART Tokens ${near.signerAccountId()}`
  )
  // TODO: Actually the address of the reserved tokens can have multiple tokens
  // Fix to account for that
  assert(
    tokenKeys.length > 1,
    `Current account owns more than 1 PART Token ${near.signerAccountId()}, no preferences allowed`
  )

  assert(
    contract.contractStatus === ContractStatusEnum.PROPERTY_SELECTION,
    `Properties not yet initialized. Please wait for it.`
  )

  assert(
    !contract.isDistributionDone(),
    `Property selection is already finished is ${near.blockTimestamp()} ended ${
      contract.distributionStart
    }`
  )

  const propertyPreference = new PropertyPreference(propertyPreferenceIds)
  contract.propertyPreferenceByTokenId.set(tokenKeys[0], propertyPreference)
}

export function internalDistributeProperties({
  contract,
}: {
  contract: Contract
}) {
  assert(
    contract.isDistributionDone(),
    `Property Selection is not yet finished is ${near.blockTimestamp()} will end ${
      contract.distributionStart
    }`
  )

  assert(
    contract.contractStatus === ContractStatusEnum.PROPERTY_SELECTION,
    `Properties not yet initialized. Please initialize them first.`
  )
  contract.contractStatus = ContractStatusEnum.PROPERTY_DISTRIBUTION

  const sortedPartTokens = internalNftTokens({ contract }).sort((a, b) => {
    return +a.token_id - +b.token_id
  })

  const reservedProperties = getValuesInVector(contract.reservedProperties)

  // loop through all token holders
  for (const partToken of sortedPartTokens) {
    const propertyPreference = contract.propertyPreferenceByTokenId.get(
      partToken.token_id
    ) as PropertyPreference | null

    if (
      !propertyPreference ||
      propertyPreference.propertyPreferenceIds?.length === 0
    ) {
      near.log(`No preference found for token ${partToken.token_id}, skipping`)
      continue
    }

    // loop through all preferences until unoccupied property found
    for (const prefPropertyId of propertyPreference.propertyPreferenceIds) {
      if (reservedProperties.includes(prefPropertyId)) {
        // skip reserved properties
        continue
      }

      if (!contract.tokensById.get(prefPropertyId)) {
        // token for this preference does not exist
        continue
      }

      const isOccupied = contract.tokenIdByProperty.get(prefPropertyId)

      if (!isOccupied) {
        contract.tokenIdByProperty.set(prefPropertyId, partToken.token_id)
        propertyPreference.whichPreferenceIsServed = partToken.token_id
        contract.propertyPreferenceByTokenId.set(
          partToken.token_id,
          propertyPreference
        )
        near.log(
          `Distributing Property ${prefPropertyId} to TokenId ${partToken.token_id}`
        )
        break
      }
    }
  }

  contract.contractStatus = ContractStatusEnum.ENDED
}
