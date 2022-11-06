import { NFTContractMetadata } from "./metadata"
import { Property } from "./property"

export type InitializeArgs = {
  projectName: string
  ownerId: string
  totalSupply: number
  price: number
  metadata: NFTContractMetadata
  reservedTokenIds?: string[]
  reservedTokenOwner?: string
  saleOpening?: string
  saleClose?: string
}

export type InitializePropertiesArgs = {
  distributionStart: string
  reservedTokenIds?: string[]
  reservedTokenOwner?: string
  totalSupply: number
}

export type EditPropertiesArgs = {
  propertyData: Property[]
}
