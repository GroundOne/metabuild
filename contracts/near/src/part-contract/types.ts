import { NFTContractMetadata } from "./metadata"
import { Property } from "./property"

export type InitializeArgs = {
  ownerId: string
  projectName: string
  totalSupply: number
  price: number
  reservedTokenIds?: string[]
  saleOpening?: string
  saleClose?: string
  metadata?: NFTContractMetadata
}

export type InitializePropertiesArgs = {
  distributionStart: string
  reservedTokenIds?: string[]
  totalSupply: number
}

export type EditPropertiesArgs = {
  propertyData: Property[]
}
