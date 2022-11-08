import { NFTContractMetadata } from "./metadata"
import { Property } from "./property"

export type InitializeArgs = {
  projectName: string
  ownerId: string
  totalSupply: number
  price: string
  metadata: NFTContractMetadata
  reservedTokenIds?: string[]
  saleOpening?: string // unix timestamp in nanoseconds (1e-9)
  saleClose?: string // unix timestamp in nanoseconds (1e-9)
}

export type InitializePropertiesArgs = {
  distributionStart: string
  reservedTokenIds?: string[]
  totalSupply: number
}

export type EditPropertiesArgs = {
  propertyData: Property[]
}
