import { assert, near } from "near-sdk-js"
import { Contract, ContractStatusEnum } from "./index"
import { TokenMetadata } from "./metadata"
import { internalMint } from "./mint"
import { getValuesInVector, internalSumOfBytes, isValueInVector } from "./utils"

export function internalParticipatePresale({
  contract,
}: {
  contract: Contract
}) {
  assert(
    !contract.isPresaleDone(),
    `Presale is already finished is ${near.blockTimestamp()} ended ${
      contract.saleOpening
    }`
  )

  const isAlreadyParticipant = isValueInVector(
    near.signerAccountId(),
    contract.presaleParticipants
  )

  assert(!isAlreadyParticipant, `Sender already participants in the presale`)

  const depositAmount = near.attachedDeposit() as bigint

  assert(
    depositAmount >= BigInt(contract.price),
    `Deposit amount ${depositAmount.toString()} must be PART price ${
      contract.price
    }`
  )

  contract.presaleParticipants.push(near.predecessorAccountId())

  near.log(`Added ${near.predecessorAccountId()} to participants`)
}

export function internalDistributeAfterPresale({
  contract,
}: {
  contract: Contract
}) {
  assert(
    near.predecessorAccountId() === contract.ownerId,
    `Only owner can distribute presale tokens among participants`
  )

  // check that presale is finished
  assert(
    contract.isPresaleDone(),
    `Please wait until the presale is finished ${contract.saleOpening}`
  )

  // check that it can only be called once
  assert(
    contract.contractStatus === ContractStatusEnum.PRESALE,
    `Can only be called when ${ContractStatusEnum.PRESALE}, is ${contract.contractStatus}`
  )
  contract.contractStatus = ContractStatusEnum.POSTPRESALE_DISTRIBUTION

  let presaleParticipants = getValuesInVector(contract.presaleParticipants)

  let i = 0
  while (i < contract.presaleParticipants.length) {
    const currentTotalSupply = contract.reservedTokenIds.length + i

    if (currentTotalSupply >= contract.totalSupply) break

    // random assign tokens to presale participants
    const seed = near.randomSeed()
    const sumOfSeed = internalSumOfBytes(seed)

    const indexOfChosenParticipant = sumOfSeed % presaleParticipants.length

    const participant = presaleParticipants[indexOfChosenParticipant]
    contract.presaleDistribution.push(participant)

    // remove participant from list
    presaleParticipants.splice(indexOfChosenParticipant, 1)

    i += 1
  }
}

export function internalCashoutUnluckyPresaleParticipants({
  contract,
}: {
  contract: Contract
}) {
  assert(
    near.predecessorAccountId() === contract.ownerId,
    `Only owner can cashout unlucky presale participants`
  )

  // participants who were unlucky get cashed out
  assert(
    contract.isPresaleDone(),
    `Please wait until the presale is finished ${contract.saleOpening}`
  )

  assert(
    contract.contractStatus === ContractStatusEnum.POSTPRESALE_DISTRIBUTION,
    `Can only be called when status ${ContractStatusEnum.POSTPRESALE_DISTRIBUTION} is ${contract.contractStatus}`
  )
  contract.contractStatus = ContractStatusEnum.POSTPRESALE_CASHOUT

  const presaleParticipants = getValuesInVector(contract.presaleParticipants)
  const presaleLuckyWinner = getValuesInVector(contract.presaleDistribution)

  const unluckyParticipants = presaleParticipants.filter(
    (x) => !presaleLuckyWinner.includes(x)
  )

  unluckyParticipants.forEach((unluckyLoser) => {
    near.log(`Refunding unlucky loser ${unluckyLoser}.`)

    const transferPromiseId = near.promiseBatchCreate(unluckyLoser)

    near.promiseBatchActionTransfer(transferPromiseId, BigInt(contract.price))
    near.promiseReturn(transferPromiseId)
  })
}

export function internalMintForPresaleParticipants({
  contract,
  metadata,
}: {
  contract: Contract
  metadata: TokenMetadata
}) {
  assert(
    near.predecessorAccountId() === contract.ownerId,
    `Only owner can mint for presale participants after presale`
  )

  assert(
    contract.contractStatus === ContractStatusEnum.POSTPRESALE_CASHOUT,
    `Can only be called when status ${ContractStatusEnum.POSTPRESALE_CASHOUT}, is ${contract.contractStatus}`
  )
  contract.contractStatus = ContractStatusEnum.SALE

  const luckyWinners = getValuesInVector(contract.presaleDistribution)

  luckyWinners.forEach((luckyWinner) => {
    internalMint({
      contract,
      metadata,
      receiver_id: luckyWinner,
    })
  })
}
