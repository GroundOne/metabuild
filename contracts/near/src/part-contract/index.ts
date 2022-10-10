import {
  assert,
  call,
  initialize,
  LookupMap,
  near,
  NearBindgen,
  UnorderedMap,
  Vector,
  view,
} from "near-sdk-js"
import { TokenMetadata } from "../part-contract/metadata"
import {
  internalNftTokens,
  internalSupplyForOwner,
  internalTokensForOwner,
  internalTotalSupply,
} from "./enumeration"
import { internalPayoutNear } from "./internal"
import { internalNftMetadata, NFTContractMetadata } from "./metadata"
import { internalMint } from "./mint"
import { internalNftPVTToken, internalNftToken } from "./nft_core"
import {
  internalCashoutUnluckyPresaleParticipants,
  internalDistributeAfterPresale,
  internalMintForPresaleParticipants,
  internalParticipatePresale,
} from "./presale"
import { internalInitPVT, internalNftPVTTokens } from "./pvt"
import { internalMintSale } from "./sale"
import { InitializeArgs, InitializePVTArgs } from "./types"
import { getValuesInHashMap, getValuesInVector } from "./utils"

/// This spec can be treated like a version of the standard.
export const NFT_METADATA_SPEC = "nft-1.0.0"

/// This is the name of the NFT standard we're using
export const NFT_STANDARD_NAME = "nep171"

export enum SaleStatusEnum {
  UNSET = "unset",
  PRESALE = "presale",
  PRESALEDISTRIBUTION = "presaledistribution",
  PRESALECASHOUT = "presalecashout",
  SALE = "sale",
  POSTSALE = "postsale",
}

@NearBindgen({ requireInit: true })
export class Contract {
  ownerId: string
  projectName: string

  // Part Metrics
  currentTokenId: number = 1 // start token IDs with `1`
  totalSupply: number = 0 // maximum amount of PARTs
  price: number // deposit for each PART
  prelaunchEnd: number // blockTimestamp when regular sales starts
  saleEnd: number // blockTimestamp when sale has finished

  reservedTokenIds: Vector // stays in ownership of deployer
  presaleParticipants: Vector // candidates which buy into the presale
  presaleDistribution: Vector // tokens assigned to candidates
  saleStatus: string

  tokensPerOwner: LookupMap
  tokensById: LookupMap
  tokenMetadataById: UnorderedMap
  metadata: NFTContractMetadata

  // PVT Metrics
  pvts: UnorderedMap
  reservedPvts: Vector
  pvtDistributionStart: number

  constructor() {
    const twoMinutes = 2 * 60 * 1e9 // nanoseconds

    const prelaunchEnd = +near.blockTimestamp().toString() + twoMinutes
    const saleEnd = +near.blockTimestamp().toString() + 2 * twoMinutes

    this.ownerId = ""
    this.projectName = "PART Token"

    // PART Metrics
    this.totalSupply = 3
    this.price = 0

    this.prelaunchEnd = prelaunchEnd
    this.saleEnd = saleEnd

    this.saleStatus = SaleStatusEnum.UNSET

    this.reservedTokenIds = new Vector("reservedTokenIds")
    this.presaleParticipants = new Vector("presaleParticipants")
    this.presaleDistribution = new Vector("presaleDistribution")

    this.tokensPerOwner = new LookupMap("tokensPerOwner")
    this.tokensById = new LookupMap("tokensById")
    this.tokenMetadataById = new UnorderedMap("tokenMetadataById")

    this.metadata = {
      spec: NFT_METADATA_SPEC,
      name: "GroundOne PART",
      symbol: "GOPART",
    }

    // PVT Metrics
    this.pvts = new UnorderedMap("pvts")
    this.reservedPvts = new Vector("reservedPvts")
    this.pvtDistributionStart = this.saleEnd + 2 * twoMinutes
  }

  @initialize({})
  init(initArgs: InitializeArgs) {
    this.ownerId = initArgs.ownerId
    this.projectName = initArgs.projectName
    this.totalSupply = initArgs.totalSupply
    this.price = initArgs.price

    if (initArgs.prelaunchEnd) this.prelaunchEnd = initArgs.prelaunchEnd

    if (initArgs.saleEnd) {
      if (initArgs.prelaunchEnd) {
        assert(
          initArgs.prelaunchEnd < initArgs.saleEnd,
          "PresaleEnd must be smaller than SaleEnd"
        )
      }

      this.saleEnd = initArgs.saleEnd
    }

    if (initArgs.metadata) this.metadata = initArgs.metadata

    if (this.nft_isSaleDone()) {
      this.saleStatus = SaleStatusEnum.POSTSALE
    } else if (this.nft_isPresaleDone()) {
      this.saleStatus = SaleStatusEnum.SALE
    } else {
      this.saleStatus = SaleStatusEnum.PRESALE
    }
    near.log(`Sale status is ${SaleStatusEnum[this.saleStatus]}`)

    // mint all reserved tokens to owner
    if (initArgs.reservedTokenIds) {
      const reservedTokenIds = initArgs.reservedTokenIds
      near.log(
        `Following Tokens will be reserved: ${JSON.stringify(reservedTokenIds)}`
      )

      reservedTokenIds.forEach((reservedTokenId) => {
        this.reservedTokenIds.push(reservedTokenId.toString())
        near.log(`Minting Reserved Token with Id ${reservedTokenId}`)
        internalMint({
          contract: this,
          metadata: this.metadata,
          receiver_id: this.ownerId,
          tokenId: reservedTokenId.toString(),
        })
      })
    }
  }

  /* PRESALE */
  @call({ payableFunction: true })
  nft_participate_presale() {
    return internalParticipatePresale({ contract: this })
  }

  @call({})
  nft_distribute_after_presale() {
    return internalDistributeAfterPresale({ contract: this })
  }

  @call({})
  nft_cashout_unlucky_presale_participants() {
    return internalCashoutUnluckyPresaleParticipants({ contract: this })
  }

  @call({ payableFunction: true })
  nft_mint_for_presale_participants({ metadata }: { metadata: TokenMetadata }) {
    return internalMintForPresaleParticipants({ contract: this, metadata })
  }

  /* SALE */
  @call({ payableFunction: true })
  nft_mint(mintArgs: { metadata: TokenMetadata; receiver_id: string }) {
    return internalMintSale({ contract: this, ...mintArgs })
  }

  @call({})
  nft_init_pvt(initArgs: InitializePVTArgs) {
    internalInitPVT({ contract: this, ...initArgs })
  }

  // @call({ payableFunction: true })
  // nft_edit_pvts(addArgs: AddPVTArgs) {
  //   return internalAddPVT({ contract: this, ...addArgs })
  // }

  @call({})
  nft_set_preferences(pvtPreferenceIds) {
    return
  }

  /* 
    OWNER
  */
  @call({})
  nft_payout_near({
    amount,
    receivingAccountId,
  }: {
    amount: number
    receivingAccountId?: string
  }) {
    return internalPayoutNear({ amount, receivingAccountId, contract: this })
  }

  /* 
    VIEWS 
  */

  /* CORE */
  @view({})
  //get the information for a specific token ID
  nft_token({ token_id }: { token_id: string }) {
    return internalNftToken({ contract: this, tokenId: token_id })
  }

  @view({})
  //get the information for a specific token ID
  nft_pvt_token({ token_id }: { token_id: string }) {
    return internalNftPVTToken({ contract: this, tokenId: token_id })
  }

  /* ENUMERATION */
  @view({})
  //Query for the total supply of NFTs on the contract
  nft_total_supply() {
    return internalTotalSupply({ contract: this })
  }

  @view({})
  //Query for nft tokens on the contract regardless of the owner using pagination
  nft_tokens(nftArgs: { from_index?: string; limit?: number }) {
    return internalNftTokens({ contract: this, ...nftArgs })
  }

  @view({})
  //Query for pvts on the contract regardless of the owner using pagination
  nft_pvt_tokens(nftArgs: { from_index?: string; limit?: number }) {
    return internalNftPVTTokens({ contract: this, ...nftArgs })
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

  // @view({})
  // //Query for all the tokens for an owner
  // nft_pvt_tokens_for_owner({
  //   account_id,
  //   from_index,
  //   limit,
  // }: {
  //   account_id: string
  //   from_index?: string
  //   limit?: number
  // }) {
  //   return internalTokenPVTsForOwner({
  //     contract: this,
  //     accountId: account_id,
  //     fromIndex: from_index,
  //     limit: limit,
  //   })
  // }

  @view({})
  //get the total supply of NFTs for a given owner
  nft_supply_for_owner({ account_id }) {
    return internalSupplyForOwner({ contract: this, accountId: account_id })
  }

  // @view({})
  // //get the total supply of NFTs for a given owner
  // nft_pvt_supply_for_owner({ account_id }) {
  //   return internalPVTSupplyForOwner({ contract: this, accountId: account_id })
  // }

  /* GENERAL */
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
      saleStatus: this.saleStatus,
    }
  }

  @view({})
  nft_pvt_vars() {
    return {
      pvts: this.nft_pvts(),
      reservedPvts: this.reservedPvts,
      pvtDistributionStart: this.pvtDistributionStart,
    }
  }

  @view({})
  //Query for all the tokens for an owner
  nft_metadata() {
    return internalNftMetadata({ contract: this })
  }

  /* PRESALE */
  @view({})
  nft_presale_participants() {
    return getValuesInVector(this.presaleParticipants)
  }

  @view({})
  nft_presale_distribution() {
    // return this.presaleDistribution
    return getValuesInVector(this.presaleDistribution)
  }

  @view({})
  nft_pvts() {
    return getValuesInHashMap(this.pvts)
  }

  /* SALE STATUS */
  @view({})
  nft_isPresaleDone() {
    return this.prelaunchEnd < near.blockTimestamp()
  }

  @view({})
  nft_isSaleDone() {
    return this.saleEnd < near.blockTimestamp()
  }

  @view({})
  nft_current_block_time() {
    return near.blockTimestamp().toString()
  }
}
