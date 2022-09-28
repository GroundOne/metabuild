import { ethers } from "hardhat"

async function main() {
  const Part = await ethers.getContractFactory("PART")
  const part = await Part.deploy()

  await part.deployed()

  console.log(`PART deployed to ${part.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
