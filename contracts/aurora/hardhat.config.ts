import "@nomicfoundation/hardhat-toolbox"
import "dotenv/config"
import { HardhatUserConfig } from "hardhat/config"

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    aurora_test: {
      chainId: 1313161555,
      url: "https://testnet.aurora.dev",
      accounts: [process.env.PRIVATE_KEY!],
    },
    aurora: {
      chainId: 1313161554,
      url: "https://mainnet.aurora.dev",
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
}

export default config
