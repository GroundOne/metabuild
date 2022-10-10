import { NFTContractMetadata } from "./metadata"
import { PVT } from "./pvt"

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
  distributionStart: number
  reservedTokenIds?: string[]
  totalSupply?: number
}

export type AddPVTArgs = {
  pvtData: PVT[]
}
