import test from "ava"
import { NEAR, Worker } from "near-workspaces"
import { SaleStatusEnum } from "./utils.js"

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
  prelaunchEnd: Number(Date.now() + 1e6 + "000000"), // add 1 second, is prelaunch now
  saleEnd: Number(Date.now() + 1e8 + "000000"), // add 100 seconds, not yet started
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
  t.is(result.saleStatus, SaleStatusEnum.PRESALE)
})

test("Call participate presale", async (t) => {
  const { contract } = t.context.accounts

  const attachedDeposit = NEAR.parse("1 N").toString()
  await contract.call(
    contract,
    "nft_participate_presale",
    {},
    { attachedDeposit }
  )

  const result = await contract.view("nft_presale_participants", {})

  t.is(result.length, 1)
  t.is(result[0], "part.test.near")
})

test("Call can't participate twice in presale", async (t) => {
  const { contract } = t.context.accounts

  const attachedDeposit = NEAR.parse("1 N").toString()
  await contract.call(
    contract,
    "nft_participate_presale",
    {},
    { attachedDeposit }
  )
  await t.throwsAsync(async () => {
    return contract.call(
      contract,
      "nft_participate_presale",
      {},
      { attachedDeposit }
    )
  })
})

test("Call should fail minting when presale not finished", async (t) => {
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

test("Call can't distribute tokens when presale not finished", async (t) => {
  const { contract, root, ali, bob } = t.context.accounts

  const attachedDeposit = NEAR.parse("1 N").toString()
  await ali.call(contract, "nft_participate_presale", {}, { attachedDeposit })
  await bob.call(contract, "nft_participate_presale", {}, { attachedDeposit })

  let result = await root.call(contract, "nft_presale_participants", {})
  t.is(result.length, 2)

  await t.throwsAsync(async () => {
    return await root.call(contract, "nft_distribute_after_presale", {})
  })
})

test("Call can't distribute tokens when caller not owner", async (t) => {
  const { contract, root, ali, bob } = t.context.accounts

  const attachedDeposit = NEAR.parse("1 N").toString()
  await ali.call(contract, "nft_participate_presale", {}, { attachedDeposit })
  await bob.call(contract, "nft_participate_presale", {}, { attachedDeposit })

  let result = await root.call(contract, "nft_presale_participants", {})
  t.is(result.length, 2)

  await t.throwsAsync(async () => {
    return await contract.call(contract, "nft_distribute_after_presale", {})
  })
})

// test.only("Call distribute tokens after presale when there are participants", async (t) => {
//   const { contract, root, ali, bob } = t.context.accounts

//   const attachedDeposit = NEAR.parse("1 N").toString()
//   await ali.call(contract, "nft_participate_presale", {}, { attachedDeposit })
//   await bob.call(contract, "nft_participate_presale", {}, { attachedDeposit })

//   let result = await root.call(contract, "nft_presale_participants", {})
//   t.is(result.length, 2)

//   t.timeout(2000 * 1e3) // wait 2 seconds, FIXME how to advance blockchain time?
//   await root.call(contract, "nft_distribute_after_presale", {})
// })

// test.only("Call can't distribute tokens after presale when there are no participants", async (t) => {
//   const { contract, root, ali, bob } = t.context.accounts

//   const attachedDeposit = NEAR.parse("1 N").toString()
//   await ali.call(contract, "nft_participate_presale", {}, { attachedDeposit })
//   await bob.call(contract, "nft_participate_presale", {}, { attachedDeposit })

//   let result = await root.call(contract, "nft_presale_participants", {})
//   t.is(result.length, 2)

//   await root.call(contract, "nft_distribute_after_presale", {})
//   // t.is(result.length, 2)
// })
