import { NFTContractMetadata, TokenMetadata } from "./metadata"

export type InitializeArgs = {
  ownerId: string
  projectName: string
  totalSupply: number
  price: number
  reservedTokenIds?: string[]
  prelaunchEnd?: number
  saleEnd?: number
  metadata?: NFTContractMetadata
}

export type InitializePVTArgs = {
  totalSupply: number
  preferenceEnd: number
  distributionEnd: number
  reservedTokenIds?: string[]
}

export type MintPVTArgs = {
  tokenId: string
  metadata: TokenMetadata
  receiver_id: string
}
