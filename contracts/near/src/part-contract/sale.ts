import { assert, near } from "near-sdk-js"
import { internalSupplyForOwner } from "./enumeration"
import { Contract, SaleStatusEnum } from "./index"
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
  assert(
    contract.isPresaleDone(),
    `Please wait until the presale is finished ${contract.prelaunchEnd}`
  )

  assert(!contract.isSaleDone(), `The sale is finished ${contract.saleEnd}`)

  assert(
    contract.currentTokenId <= contract.totalSupply,
    `Total amount of tokens already minted ${contract.totalSupply}`
  )

  assert(
    contract.saleStatus === SaleStatusEnum.SALE,
    `Can only be called when prelaunchEnd, distribution, cashout and presale minting finished and status \`sale\`, is ${contract.saleStatus}`
  )

  assert(
    near.currentAccountId() != contract.ownerId &&
      internalSupplyForOwner({ contract, accountId: near.currentAccountId() }) >
        0,
    `Sender already owns PART Token`
  )

  const depositAmount = near.attachedDeposit() as bigint

  assert(
    +depositAmount.toString() >= contract.price,
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
