import { NFTContractMetadata } from "./metadata"
import { Property } from "./property"

export type InitializeArgs = {
  ownerId: string
  projectName: string
  totalSupply: number
  price: number
  reservedTokenIds?: string[]
  saleOpening?: number
  saleClose?: number
  metadata?: NFTContractMetadata
}

export type InitializePropertiesArgs = {
  distributionStart: number
  reservedTokenIds?: string[]
  totalSupply: number
}

export type EditPropertiesArgs = {
  propertyData: Property[]
}
