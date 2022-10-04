import { assert, near } from "near-sdk-js"
import { Contract, SaleStatusEnum } from "./index"
import { TokenMetadata } from "./metadata"
import { internalMint } from "./mint"
import { getValuesInVector, internalSumOfBytes, isValueInVector } from "./utils"

export function internalParticipatePresale({
  contract,
}: {
  contract: Contract
}) {
  assert(
    !contract.nft_isPresaleDone(),
    `Presale is already finished is ${near.blockTimestamp()} ended ${
      contract.prelaunchEnd
    }`
  )

  const isAlreadyParticipant = isValueInVector(
    near.signerAccountId(),
    contract.presaleParticipants
  )

  assert(!isAlreadyParticipant, `Sender already participants in the presale`)

  const depositAmount = near.attachedDeposit() as bigint

  assert(
    +depositAmount.toString() >= contract.price,
    `Deposit amount ${depositAmount.toString()} must be PART price ${
      contract.price
    }`
  )

  contract.presaleParticipants.push(near.signerAccountId())

  near.log(`Added ${near.signerAccountId()} to participants`)
}

export function internalDistributeAfterPresale({
  contract,
}: {
  contract: Contract
}) {
  assert(
    near.currentAccountId() === contract.ownerId,
    `Only owner can distribute after presale`
  )

  // check that presale is finished
  assert(
    contract.nft_isPresaleDone(),
    `Please wait until the presale is finished ${contract.prelaunchEnd}`
  )

  // check that it can only be called once
  assert(
    contract.saleStatus === SaleStatusEnum.PRESALE,
    `Can only be called when prelaunchEnd finished and status \`presale\`, is ${contract.saleStatus}`
  )
  contract.saleStatus = SaleStatusEnum.PRESALEDISTRIBUTION

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
    near.currentAccountId() === contract.ownerId,
    `Only owner can cashout after presale`
  )

  // participants who were unlucky get cashed out
  // assert(
  //   contract.nft_isPresaleDone(),
  //   `Please wait until the presale is finished ${contract.prelaunchEnd}`
  // )

  assert(
    contract.saleStatus === SaleStatusEnum.PRESALEDISTRIBUTION,
    `Can only be called when prelaunchEnd and distribution finished and status \`presaledistribution\` is ${contract.saleStatus}`
  )
  contract.saleStatus = SaleStatusEnum.PRESALECASHOUT

  const presaleParticipants = getValuesInVector(contract.presaleParticipants)
  const presaleLuckyWinner = getValuesInVector(contract.presaleDistribution)

  const unluckyParticipants = presaleParticipants.filter(
    (x) => !presaleLuckyWinner.includes(x)
  )

  unluckyParticipants.forEach((unluckyLoser) => {
    near.log(`Refunding unlucky loser ${unluckyLoser}.`)

    near.log(`NOT YET IMPLEMENTED`)
    // TODO
    // contract.transfer(unluckyLoser, this.price)
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
    near.currentAccountId() === contract.ownerId,
    `Only owner can mint for presale participants after presale`
  )

  assert(
    contract.saleStatus === SaleStatusEnum.PRESALECASHOUT,
    `Can only be called when prelaunchEnd, distribution and cashout finished and status \`presalecashout\`, is ${contract.saleStatus}`
  )
  contract.saleStatus = SaleStatusEnum.SALE

  const luckyWinners = getValuesInVector(contract.presaleDistribution)

  luckyWinners.forEach((luckyWinner) => {
    internalMint({
      contract,
      metadata,
      receiver_id: luckyWinner,
    })
  })
}
