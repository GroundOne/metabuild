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
import {
  internalNftTokens,
  internalSupplyForOwner,
  internalTokensForOwner,
  internalTotalSupply,
} from "./enumeration"
import { internalArchiveContract, internalPayoutNear } from "./internal"
import {
  internalNftMetadata,
  NFTContractMetadata,
  TokenMetadata,
} from "./metadata"
import { internalMint } from "./mint"
import { internalNftToken } from "./nft_core"
import {
  internalCashoutUnluckyPresaleParticipants,
  internalDistributeAfterPresale,
  internalMintForPresaleParticipants,
  internalParticipatePresale,
} from "./presale"
import {
  internalDistributeProperties,
  internalInitProperties,
  internalPropertiesInfo,
  internalPropertyInfo,
  internalSetPropertyPreferences,
} from "./property"
import { internalMintSale } from "./sale"
import { InitializeArgs, InitializePropertiesArgs } from "./types"
import { getValuesInHashMap, getValuesInVector } from "./utils"

/// This spec can be treated like a version of the standard.
export const NFT_METADATA_SPEC = "nft-1.0.0"

/// This is the name of the NFT standard we're using
export const NFT_STANDARD_NAME = "nep171"

export enum ContractStatusEnum {
  UNSET = "unset",
  PRESALE = "presale",
  POSTPRESALE_DISTRIBUTION = "postpresale_distribution",
  POSTPRESALE_CASHOUT = "postpresale_cashout",
  SALE = "sale",
  PROPERTY_SELECTION = "property_selection",
  PROPERTY_DISTRIBUTION = "property_distribution",
  ENDED = "ended",
}

@NearBindgen({ requireInit: true })
export class Contract {
  ownerId: string
  projectName: string
  projectBackgroundUrl: string
  isArchived: boolean

  // Part Metrics
  currentTokenId: number = 1 // start token IDs with `1`
  totalSupply: number = 0 // maximum amount of PARTs
  price: string // deposit for each PART
  saleOpening: string // blockTimestamp when regular sales starts
  saleClose: string // blockTimestamp when sale has finished

  reservedTokenIds: Vector // stays in ownership of deployer
  presaleParticipants: Vector // candidates which buy into the presale
  presaleDistribution: Vector // tokens assigned to candidates
  contractStatus: string

  tokensPerOwner: LookupMap
  tokensById: LookupMap
  tokenMetadataById: UnorderedMap
  metadata: NFTContractMetadata

  // Property Metrics
  properties: UnorderedMap
  reservedProperties: Vector
  distributionStart: string
  propertyPreferenceByTokenId: UnorderedMap
  tokenIdByProperty: UnorderedMap

  constructor() {
    const twoMinutes = BigInt((2 * 60 * 1e9).toString()) // nanoseconds

    const saleOpening = near.blockTimestamp() + twoMinutes
    const saleClose = saleOpening + twoMinutes

    this.ownerId = ""
    this.projectName = "PART Token"
    this.projectBackgroundUrl = ""
    this.isArchived = false

    // PART Metrics
    this.totalSupply = 3
    this.price = `0`

    this.saleOpening = saleOpening.toString()
    this.saleClose = saleClose.toString()

    this.contractStatus = ContractStatusEnum.UNSET

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

    // Property Metrics
    this.properties = new UnorderedMap("properties")
    this.reservedProperties = new Vector("reservedProperties")
    this.distributionStart = `0`
    this.propertyPreferenceByTokenId = new UnorderedMap(
      "propertyPreferenceByTokenId"
    )
    this.tokenIdByProperty = new UnorderedMap("tokenIdByProperty")
  }

  @initialize({})
  init(initArgs: InitializeArgs) {
    this.projectName = initArgs.projectName
    if (initArgs.projectBackgroundUrl)
      this.projectBackgroundUrl = initArgs.projectBackgroundUrl

    this.ownerId = initArgs.ownerId
    this.totalSupply = initArgs.totalSupply
    this.price = initArgs.price

    if (initArgs.saleOpening)
      this.saleOpening = BigInt(initArgs.saleOpening).toString()

    if (initArgs.saleClose) {
      if (initArgs.saleOpening) {
        assert(
          BigInt(initArgs.saleOpening) < BigInt(initArgs.saleClose),
          `Sale opening must be before SaleClose, sale opening is ${initArgs.saleOpening}, sale close ${initArgs.saleClose}`
        )
      }

      assert(
        BigInt(initArgs.saleClose) > near.blockTimestamp(),
        `Sale close must be in the future, sale close ${
          initArgs.saleClose
        }, current time ${near.blockTimestamp().toString()}`
      )

      this.saleClose = BigInt(initArgs.saleClose).toString()
    }

    this.metadata = initArgs.metadata

    if (this.isPresaleDone()) {
      this.contractStatus = ContractStatusEnum.SALE
    } else {
      this.contractStatus = ContractStatusEnum.PRESALE
    }
    near.log(`Sale status is ${this.contractStatus}`)

    // mint all reserved tokens to owner
    if (initArgs.reservedTokenIds) {
      assert(
        initArgs.totalSupply >
          Math.max.apply(initArgs.reservedTokenIds.map((t) => +t)),
        `Amount of tokens must be greater than highest reserved token Id. Amount of tokens ${
          initArgs.totalSupply
        }, reserved tokens: ${initArgs.reservedTokenIds.join(", ")}`
      )

      const reservedTokenIds = initArgs.reservedTokenIds
      near.log(
        `Following Tokens will be reserved: ${JSON.stringify(reservedTokenIds)}`
      )

      reservedTokenIds.forEach((reservedTokenId) => {
        this.reservedTokenIds.push(reservedTokenId)

        internalMint({
          contract: this,
          metadata: this.metadata,
          receiver_id: this.ownerId,
          tokenId: reservedTokenId,
        })
      })
    }
  }

  /* PRESALE */
  @call({ payableFunction: true })
  participate_presale() {
    return internalParticipatePresale({ contract: this })
  }

  @call({ payableFunction: true })
  postpresale_proceed_to_sale({ metadata }: { metadata: TokenMetadata }) {
    // combines the methods for convenience
    internalDistributeAfterPresale({ contract: this })
    internalCashoutUnluckyPresaleParticipants({ contract: this })
    return internalMintForPresaleParticipants({ contract: this, metadata })
  }

  @call({})
  distribute_after_presale() {
    return internalDistributeAfterPresale({ contract: this })
  }

  @call({})
  cashout_unlucky_presale_participants() {
    return internalCashoutUnluckyPresaleParticipants({ contract: this })
  }

  @call({ payableFunction: true })
  mint_for_presale_participants({ metadata }: { metadata: TokenMetadata }) {
    return internalMintForPresaleParticipants({ contract: this, metadata })
  }

  /* SALE */
  @call({ payableFunction: true })
  nft_mint(mintArgs: { metadata: TokenMetadata; receiver_id: string }) {
    return internalMintSale({ contract: this, ...mintArgs })
  }

  /* POSTSALE */
  @call({})
  init_properties(initArgs: InitializePropertiesArgs) {
    internalInitProperties({ contract: this, ...initArgs })
  }

  // @call({ payableFunction: true })
  // edit_properties(addArgs: EditPropertiesArgs) {
  //   return internalEditProperties({ contract: this, ...addArgs })
  // }

  @call({})
  set_preferences_properties({
    propertyPreferenceIds,
  }: {
    propertyPreferenceIds: string[]
  }) {
    return internalSetPropertyPreferences({
      propertyPreferenceIds,
      contract: this,
    })
  }

  /* DISTRIBUTION */
  @call({})
  distribute_properties() {
    return internalDistributeProperties({ contract: this })
  }

  @call({})
  archive_contract({ isArchived }: { isArchived: boolean }) {
    return internalArchiveContract({ isArchived, contract: this })
  }

  /*
    OWNER
  */
  @call({})
  payout_near({
    amount,
    receivingAccountId,
  }: {
    amount?: number
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
  //Query for properties on the contract regardless of the owner using pagination
  properties_info(nftArgs: { from_index?: string; limit?: number }) {
    return internalPropertiesInfo({ contract: this, ...nftArgs })
  }

  @view({})
  //get the information for a specific token ID
  property_info({ id }: { id: string }) {
    return internalPropertyInfo({ contract: this, id })
  }

  /* GENERAL */
  @view({})
  contract_vars() {
    return {
      ownerId: this.ownerId,
      soldTokens: this.tokenMetadataById.length - this.reservedTokenIds.length,
      currentTokenId: this.currentTokenId,
      projectName: this.projectName,
      projectBackgroundUrl: this.projectBackgroundUrl,
      projectAddress: near.currentAccountId(),
      totalSupply: this.totalSupply,
      price: this.price,
      reservedTokenIds: getValuesInVector(this.reservedTokenIds),
      saleOpening: this.saleOpening,
      saleClose: this.saleClose,
      contractStatus: this.contractStatus,
      properties: this.current_properties(),
      reservedProperties: getValuesInVector(this.reservedProperties),
      distributionStart: this.distributionStart,
      isArchived: this.isArchived,
    }
  }

  @view({})
  //Query for all the tokens for an owner
  nft_metadata() {
    return internalNftMetadata({ contract: this })
  }

  /* PRESALE */
  @view({})
  presale_participants() {
    return getValuesInVector(this.presaleParticipants)
  }

  @view({})
  presale_distribution() {
    return getValuesInVector(this.presaleDistribution)
  }

  @view({})
  current_properties() {
    return getValuesInHashMap(this.properties)
  }

  @view({})
  property_preferences() {
    return getValuesInHashMap(this.propertyPreferenceByTokenId)
  }

  @view({})
  distributed_properties() {
    return getValuesInHashMap(this.tokenIdByProperty)
  }

  /* SALE STATUS */
  @view({})
  isPresaleDone() {
    return BigInt(this.saleOpening) < near.blockTimestamp()
  }

  @view({})
  isSaleDone() {
    return BigInt(this.saleClose) < near.blockTimestamp()
  }

  @view({})
  isDistributionDone() {
    return BigInt(this.distributionStart) < near.blockTimestamp()
  }

  @view({})
  current_block_time() {
    return near.blockTimestamp().toString()
  }
}
