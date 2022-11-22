import { assert, near } from "near-sdk-js"
import { internalSupplyForOwner } from "./enumeration"
import { Contract, ContractStatusEnum } from "./index"
import { TokenMetadata } from "./metadata"
import { internalMint } from "./mint"

export function internalMintSale({
  contract,
  metadata,
  receiver_id,
}: {
  contract: Contract
  metadata: TokenMetadata
  receiver_id: string
}) {
  // TODO: Make it possible to mint directly after presale has finished
  // without having to wait for lifetime methods to be finished
  assert(
    contract.isPresaleDone(),
    `Please wait until the presale is finished ${contract.saleOpening}`
  )

  assert(!contract.isSaleDone(), `The sale is finished ${contract.saleClose}`)

  assert(
    contract.currentTokenId <= contract.totalSupply,
    `Total amount of tokens already minted ${contract.totalSupply}`
  )

  assert(
    contract.contractStatus === ContractStatusEnum.SALE,
    `Can only be called when saleOpening, distribution, cashout and presale minting finished and status \`sale\`, is ${contract.contractStatus}`
  )

  assert(
    internalSupplyForOwner({ contract, accountId: near.signerAccountId() }) ==
      0,
    `Sender already owns PART Token`
  )

  const depositAmount = near.attachedDeposit() as bigint

  assert(
    depositAmount >= BigInt(contract.price),
    `Deposit amount ${depositAmount.toString()} must be PART price ${
      contract.price
    }`
  )

  return internalMint({
    contract,
    metadata,
    receiver_id,
  })
}
