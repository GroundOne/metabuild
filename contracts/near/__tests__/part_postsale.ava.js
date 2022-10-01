import test from "ava"
import { NEAR, Worker } from "near-workspaces"
import { SaleStatusEnum } from "./utils"

const meta_specification = {
  spec: "nft-1.0.0",
  name: "GroundOne PART",
  symbol: "GOPART",
}

const constructor_args = {
  ownerId: "test.near",
  projectName: "GroundOne PART",
  totalSupply: 3,
  price: "1000000000000000000000",
  reservedTokenIds: [`2`],
  prelaunchEnd: Number(Date.now() - 1e7 + "000000"), // presale is finished
  saleEnd: Number(Date.now() - 1e6 + "000000"), // sale is finished
  metadata: meta_specification,
}

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init()

  // Prepare sandbox for tests, create accounts, deploy contracts, etc.
  const root = worker.rootAccount
  const contract = await root.createSubAccount("part")

  await contract.deploy("./build/part.wasm")

  const attachedDeposit = NEAR.parse("1 N").toString()
  await contract.call(contract, "init", constructor_args, { attachedDeposit })

  // Test users
  const ali = await root.createSubAccount("ali")
  const bob = await root.createSubAccount("bob")

  // Save state for test runs
  t.context.worker = worker
  t.context.accounts = { root, contract, ali, bob }
})

// If the environment is reused, use test.after to replace test.afterEach
test.afterEach(async (t) => {
  await t.context.worker.tearDown().catch((error) => {
    console.log("Failed to tear down the worker:", error)
  })
})

test.only("View the correct variables", async (t) => {
  const { contract } = t.context.accounts

  const result = await contract.view("nft_vars", {})

  t.is(result.currentTokenId, 1)
  t.is(result.ownerId, "test.near")
  t.is(result.projectName, constructor_args.projectName)
  t.is(result.totalSupply, constructor_args.totalSupply)
  t.is(result.price, constructor_args.price)
  t.deepEqual(result.reservedTokenIds, {
    length: 1,
    prefix: "reservedTokenIds",
  })
  t.is(result.prelaunchEnd, constructor_args.prelaunchEnd)
  t.is(result.saleEnd, constructor_args.saleEnd)
  t.is(result.saleStatus, SaleStatusEnum.POSTSALE)
})

test("Call should fail minting when sale is already finished", async (t) => {
  const { contract } = t.context.accounts

  const attachedDeposit = NEAR.parse("1 N").toString()
  const token = {
    metadata: {
      title: "GroundOne PART Token",
      description: "Token ID is your ranking.",
      media:
        "https://bafybeiftczwrtyr3k7a2k4vutd3amkwsmaqyhrdzlhvpt33dyjivufqusq.ipfs.dweb.link/goteam-gif.gif",
    },
    receiver_id: "test.near",
  }

  await t.throwsAsync(async () => {
    return contract.call(contract, "nft_mint", token, { attachedDeposit })
  })
})
