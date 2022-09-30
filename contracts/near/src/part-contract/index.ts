import {
  assert,
  near,
  NearBindgen,
  call,
  view,
  LookupMap,
  UnorderedMap,
  initialize,
  Vector,
} from "near-sdk-js"
import {
  internalNftTokens,
  internalSupplyForOwner,
  internalTokensForOwner,
  internalTotalSupply,
} from "./enumeration"
import { internalGetValuesInVector, internalIsValueInVector } from "./internal"
import { NFTContractMetadata, internalNftMetadata } from "./metadata"
import { internalMint } from "./mint"
import { internalNftToken } from "./nft_core"

/// This spec can be treated like a version of the standard.
export const NFT_METADATA_SPEC = "nft-1.0.0"

/// This is the name of the NFT standard we're using
export const NFT_STANDARD_NAME = "nep171"

@NearBindgen({ requireInit: true })
export class Contract {
  ownerId: string

  currentTokenId: number = 1 // start token IDs with `1`

  // project related vars
  projectName: string
  totalSupply: number = 0 // maximum amount of PARTs
  price: number // deposit for each PART
  prelaunchEnd: number // blockTimestamp when regular sales starts
  saleEnd: string // blockTimestamp when sale has finished

  // complex types
  reservedTokenIds: Vector // stays in ownership of deployer
  presaleParticipants: Vector // candidates which buy into the presale

  tokensPerOwner: LookupMap
  tokensById: LookupMap
  tokenMetadataById: UnorderedMap
  metadata: NFTContractMetadata

  constructor() {
    const tenMinutes = 60 * 10 * 1e6 // nanosecods
    const oneHour = 60 * 60 * 1e6

    const prelaunchEnd = +near.blockTimestamp().toString() + tenMinutes
    const saleEnd = +near.blockTimestamp().toString() + oneHour

    this.ownerId = ""
    this.projectName = "PART Token"
    this.totalSupply = 3
    this.price = 0

    this.prelaunchEnd = prelaunchEnd
    this.saleEnd = saleEnd.toString()

    this.reservedTokenIds = new Vector("reservedTokenIds")
    this.presaleParticipants = new Vector("presaleParticipants")
    this.tokensPerOwner = new LookupMap("tokensPerOwner")
    this.tokensById = new LookupMap("tokensById")
    this.tokenMetadataById = new UnorderedMap("tokenMetadataById")

    this.metadata = {
      spec: NFT_METADATA_SPEC,
      name: "GroundOne PART",
      symbol: "GOPART",
    }
  }

  @initialize({})
  init({
    ownerId,
    projectName,
    totalSupply,
    price,
    reservedTokenIds,
    prelaunchEnd,
    saleEnd,
    metadata,
  }: {
    ownerId: string
    projectName: string
    totalSupply: number
    price: number
    reservedTokenIds?: string[]
    prelaunchEnd?: number
    saleEnd?: string
    metadata?: NFTContractMetadata
  }) {
    this.ownerId = ownerId
    this.projectName = projectName
    this.totalSupply = totalSupply
    this.price = price

    if (prelaunchEnd) this.prelaunchEnd = prelaunchEnd
    if (saleEnd) this.saleEnd = saleEnd
    if (metadata) this.metadata = metadata

    // mint all reserved tokens to owner
    near.log(
      `Following Tokens will be reserved: ${JSON.stringify(reservedTokenIds)}`
    )

    if (reservedTokenIds) {
      reservedTokenIds.forEach((reservedTokenId) => {
        this.reservedTokenIds.push(reservedTokenId.toString())

        near.log(`Minting Reserved Token with Id ${reservedTokenId}`)

        internalMint({
          contract: this,
          metadata: this.metadata,
          receiverId: this.ownerId,
          tokenId: reservedTokenId.toString(),
        })
      })
    }
  }

  @call({ payableFunction: true })
  nft_participate_presale() {
    assert(
      !this.nft_isPresaleDone(),
      `Presale is already finished is ${near.blockTimestamp()} ended ${
        this.prelaunchEnd
      }`
    )

    const isAlreadyParticipant = internalIsValueInVector(
      near.signerAccountId(),
      this.presaleParticipants
    )

    assert(!isAlreadyParticipant, `Sender already participants in the presale`)

    const depositAmount = near.attachedDeposit() as bigint

    assert(
      +depositAmount.toString() >= this.price,
      `Deposit amount ${depositAmount.toString()} must be PART price ${
        this.price
      }`
    )

    this.presaleParticipants.push(near.signerAccountId())

    near.log(`Added ${near.signerAccountId()} to participants`)
  }

  @call({ payableFunction: true })
  nft_mint({
    metadata,
    receiver_id,
  }: {
    metadata: Record<string, any>
    receiver_id: string
  }) {
    assert(
      this.nft_isPresaleDone(),
      `Please wait until the presale is finished ${this.prelaunchEnd}`
    )

    assert(!this.nft_isSaleDone(), `The sale is finished ${this.saleEnd}`)

    assert(
      this.currentTokenId <= this.totalSupply,
      `Total amount of tokens already minted ${this.totalSupply}`
    )

    const depositAmount = near.attachedDeposit() as bigint

    assert(
      +depositAmount.toString() >= this.price,
      `Deposit amount ${depositAmount.toString()} must be PART price ${
        this.price
      }`
    )

    return internalMint({
      contract: this,
      metadata,
      receiverId: receiver_id,
    })
  }

  @call({})
  nft_payout_owner() {}

  /* CORE */
  @view({})
  //get the information for a specific token ID
  nft_token({ token_id }: { token_id: string }) {
    return internalNftToken({ contract: this, tokenId: token_id })
  }

  /* ENUMERATION */
  @view({})
  //Query for the total supply of NFTs on the contract
  nft_total_supply() {
    return internalTotalSupply({ contract: this })
  }

  @view({})
  //Query for nft tokens on the contract regardless of the owner using pagination
  nft_tokens({ from_index, limit }: { from_index?: string; limit?: number }) {
    return internalNftTokens({
      contract: this,
      fromIndex: from_index,
      limit: limit,
    })
  }

  @view({})
  //Query for all the tokens for an owner
  nft_tokens_for_owner({
    account_id,
    from_index,
    limit,
  }: {
    account_id: string
    from_index?: string
    limit?: number
  }) {
    return internalTokensForOwner({
      contract: this,
      accountId: account_id,
      fromIndex: from_index,
      limit: limit,
    })
  }

  @view({})
  //get the total supply of NFTs for a given owner
  nft_supply_for_owner({ account_id }) {
    return internalSupplyForOwner({ contract: this, accountId: account_id })
  }

  @view({})
  nft_vars() {
    return {
      ownerId: this.ownerId,
      currentTokenId: this.currentTokenId,
      projectName: this.projectName,
      totalSupply: this.totalSupply,
      price: this.price,
      reservedTokenIds: this.reservedTokenIds,
      prelaunchEnd: this.prelaunchEnd,
      saleEnd: this.saleEnd,
    }
  }

  @view({})
  nft_presale_participants() {
    return internalGetValuesInVector(this.presaleParticipants)
  }

  @view({})
  nft_isPresaleDone() {
    return +this.prelaunchEnd < near.blockTimestamp()
  }

  @view({})
  nft_isSaleDone() {
    return +this.saleEnd < near.blockTimestamp()
  }

  /* METADATA */
  @view({})
  //Query for all the tokens for an owner
  nft_metadata() {
    return internalNftMetadata({ contract: this })
  }
}
