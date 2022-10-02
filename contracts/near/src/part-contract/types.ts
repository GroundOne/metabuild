import { NFTContractMetadata } from "./metadata"

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
