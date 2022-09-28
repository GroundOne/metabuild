import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"

import { expect } from "chai"
import { ethers } from "hardhat"

describe("PART", function () {
  async function deployPart() {
    const [owner, otherAccount] = await ethers.getSigners()

    const Part = await ethers.getContractFactory("PART")
    const part = await Part.deploy()

    return { Part, part, owner, otherAccount }
  }

  describe("Deployment", function () {
    it("Should have a minter role", async function () {
      const { part } = await loadFixture(deployPart)

      const minterRole = await part.MINTER_ROLE()
      const minterRoleKeccak = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("MINTER_ROLE")
      )

      expect(minterRole).to.equal(minterRoleKeccak)
    })
  })
})
