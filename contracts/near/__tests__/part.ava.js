import { Worker } from "near-workspaces"
import test from "ava"

function getArgs(root) {
  const meta_specification = {
    spec: "nft-1.0.0",
    name: "GroundOne PART",
    symbol: "GOPART",
  }

  const constructor_args = {
    ownerId: root,
    projectName: "GroundOne PART",
    totalSupply: 3,
    price: "100",
    reserved_token_ids: [2],
    prelaunch_end: "9",
    sale_end: "99",
    metadata: meta_specification,
  }

  return { meta_specification, constructor_args }
}

let root

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init()

  // Prepare sandbox for tests, create accounts, deploy contracts, etc.
  root = worker.rootAccount
  const contract = await root.createSubAccount("part")
  await contract.deploy("./build/part.wasm")

  const { constructor_args } = getArgs(root)

  await contract.call(contract, "init", constructor_args)

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

test("Show the correct metadata", async (t) => {
  const { contract } = t.context.accounts

  const result = await contract.view("nft_metadata", {})

  const { meta_specification } = getArgs(root)

  t.is(result, meta_specification)
  t.pass()
})

test("Show the correct variables", async (t) => {
  const { contract } = t.context.accounts

  const result = await contract.view("nft_vars", {})

  const { constructor_args } = getArgs(root)

  // t.is(result.currentTokenId, constructor_args.currentTokenId)
  // t.is(result.ownerId, constructor_args.ownerId)
  t.is(result.projectName, constructor_args.projectName)
  t.is(result.totalSupply, constructor_args.totalSupply)
  t.is(result.price, constructor_args.price)
  t.is(result.prelaunchEnd, constructor_args.prelaunchEnd)
  t.is(result.saleEnd, constructor_args.saleEnd)
})

// test("Increase works", async (t) => {
//   const { contract, ali, bob } = t.context.accounts
//   await ali.call(contract, "increase", {})

//   let result = await contract.view("getCount", {})
//   t.is(result, 1)

//   await bob.call(contract, "increase", { n: 4 })
//   result = await contract.view("getCount", {})
//   t.is(result, 5)
// })

// test("Decrease works", async (t) => {
//   const { contract, ali, bob } = t.context.accounts
//   await ali.call(contract, "decrease", {})

//   let result = await contract.view("getCount", {})
//   t.is(result, -1)

//   await bob.call(contract, "decrease", { n: 4 })
//   result = await contract.view("getCount", {})
//   t.is(result, -5)
// })
