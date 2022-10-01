import test from "ava"
import { NEAR, Worker } from "near-workspaces"

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
  prelaunchEnd: 8,
  saleEnd: 888,
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

test("View the correct metadata", async (t) => {
  const { contract } = t.context.accounts

  const result = await contract.view("nft_metadata", {})

  t.deepEqual(result, meta_specification)
})

test("View the correct variables", async (t) => {
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
})

test("View the correct reserved token", async (t) => {
  const { contract } = t.context.accounts

  const token_id = constructor_args.reservedTokenIds[0]
  const result = await contract.view("nft_token", { token_id })

  const reservedToken = {
    token_id: "2",
    owner_id: "test.near",
    metadata: { spec: "nft-1.0.0", name: "GroundOne PART", symbol: "GOPART" },
    approved_account_ids: {},
  }

  t.deepEqual(result, reservedToken)
})

test("View the correct total supply", async (t) => {
  const { contract } = t.context.accounts

  const result = await contract.view("nft_total_supply", {})

  t.is(result, constructor_args.reservedTokenIds.length)
})

test("View all tokens", async (t) => {
  const { contract } = t.context.accounts

  const result = await contract.view("nft_tokens", {})

  const allTokens = [
    {
      token_id: "2",
      owner_id: "test.near",
      metadata: { spec: "nft-1.0.0", name: "GroundOne PART", symbol: "GOPART" },
      approved_account_ids: {},
    },
  ]
  t.deepEqual(result, allTokens)
})

test("View tokens of owner", async (t) => {
  const { contract } = t.context.accounts

  const account_id = "test.near"
  const result = await contract.view("nft_tokens_for_owner", { account_id })

  const ownerTokens = [
    {
      token_id: "2",
      owner_id: "test.near",
      metadata: { spec: "nft-1.0.0", name: "GroundOne PART", symbol: "GOPART" },
      approved_account_ids: {},
    },
  ]

  t.deepEqual(result, ownerTokens)
})

test("View supply of owner", async (t) => {
  const { contract } = t.context.accounts

  const account_id = "test.near"
  const result = await contract.view("nft_supply_for_owner", { account_id })

  const tokenSupply = 1

  t.is(result, tokenSupply)
})

test("View isPresaleDone", async (t) => {
  const { contract } = t.context.accounts

  const result = await contract.view("nft_isPresaleDone", {})

  t.is(result, true)
})

test("View isSaleDone", async (t) => {
  const { contract } = t.context.accounts

  const result = await contract.view("nft_isSaleDone", {})

  t.is(result, true)
})

test("View presale participants", async (t) => {
  const { contract } = t.context.accounts

  const result = await contract.view("nft_presale_participants", {})

  t.is(result.length, 0)
})

test("View presale distribution", async (t) => {
  const { contract } = t.context.accounts

  const result = await contract.view("nft_presale_distribution", {})

  t.is(result.length, 0)
})
