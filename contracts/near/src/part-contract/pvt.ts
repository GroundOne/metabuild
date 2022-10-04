import { assert, near } from "near-sdk-js"
import { Contract } from "./index"
import { InitializePVTArgs } from "./types"

export function internalInitPVT(
  initArgs: InitializePVTArgs & { contract: Contract }
) {
  const contract = initArgs.contract

  assert(
    near.signerAccountId() === contract.ownerId,
    `Only owner can distribute after presale`
  )

  contract.pvtTotalSupply = initArgs.totalSupply

  if (contract.pvtPreferenceChoiceEnd)
    contract.pvtPreferenceChoiceEnd = initArgs.preferenceEnd
  if (contract.pvtDistributionEnd)
    contract.pvtDistributionEnd = initArgs.distributionEnd

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
