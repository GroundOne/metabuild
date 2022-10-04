import { assert, near } from "near-sdk-js"
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
    contract.nft_isPresaleDone(),
    `Please wait until the presale is finished ${contract.prelaunchEnd}`
  )

  assert(!contract.nft_isSaleDone(), `The sale is finished ${contract.saleEnd}`)

  assert(
    contract.currentTokenId <= contract.totalSupply,
    `Total amount of tokens already minted ${contract.totalSupply}`
  )

  // assert(
  //   SaleStatusEnum[contract.saleStatus] === SaleStatusEnum.SALE,
  //   `Can only be called when prelaunchEnd, distribution, cashout and presale minting finished and status \`sale\`, is ${
  //     SaleStatusEnum[contract.saleStatus]
  //   }`
  // )

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
    receiverId: receiver_id,
  })
}
