import test from "ava"
import { NEAR, Worker } from "near-workspaces"
import { SaleStatusEnum } from "./utils.js"

const meta_specification = {
  spec: "nft-1.0.0",
  name: "GroundOne PART",
  symbol: "GOPART",
}

const constructor_args = {
  ownerId: "part.test.near",
  projectName: "GroundOne PART",
  totalSupply: 4,
  price: "1000000000000000000000",
  reservedTokenIds: [`2`],
  prelaunchEnd: Number(Date.now() - 1e6 + "000000"), // presale has finished
  saleEnd: Number(Date.now() + 1e8 + "000000"), // add 100 seconds
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
  t.is(result.saleStatus, SaleStatusEnum.SALE)
})

test("Call distribute tokens after presale when there are participants", async (t) => {
  const { contract, root, ali, bob } = t.context.accounts

  const attachedDeposit = NEAR.parse("1 N").toString()
  await root.call(contract, "nft_participate_presale", {}, { attachedDeposit })
  await contract.call(
    contract,
    "nft_participate_presale",
    {},
    { attachedDeposit }
  )
  await ali.call(contract, "nft_participate_presale", {}, { attachedDeposit })
  await bob.call(contract, "nft_participate_presale", {}, { attachedDeposit })

  let result = await root.call(contract, "nft_presale_participants", {})
  t.is(result.length, 4)

  // t.timeout(2000 * 1e3) // wait 2 seconds, FIXME how to advance blockchain time?
  await root.call(contract, "nft_distribute_after_presale", {})

  result = await contract.view("nft_presale_distribution", {})
  t.is(result.length, 3)
})

test("Call distribute tokens after presale when there are no participants", async (t) => {
  const { contract, root, ali, bob } = t.context.accounts

  let result = await root.call(contract, "nft_presale_participants", {})
  t.is(result.length, 0)

  // t.timeout(2000 * 1e3) // wait 2 seconds, FIXME how to advance blockchain time?
  await root.call(contract, "nft_distribute_after_presale", {})

  result = await contract.view("nft_presale_distribution", {})
  t.is(result.length, 0)
})

test.only("Call cashout unlucky participants after presale", async (t) => {
  // const { contract, root, ali, bob } = t.context.accounts
  const { worker, contract } = t.context

  console.log(`Result ${JSON.stringify(worker.provider)}`)
  // let result = await contract.accountBalance()

  const attachedDeposit = NEAR.parse("1 N").toString()
  contract.transfer(attachedDeposit)

  // await root.call(contract, "nft_participate_presale", {}, { attachedDeposit })
  // await contract.call(
  //   contract,
  //   "nft_participate_presale",
  //   {},
  //   { attachedDeposit }
  // )
  // await ali.call(contract, "nft_participate_presale", {}, { attachedDeposit })
  // await bob.call(contract, "nft_participate_presale", {}, { attachedDeposit })

  // let result = await root.call(contract, "nft_presale_participants", {})
  // t.is(result.length, 4)

  // // t.timeout(2000 * 1e3) // wait 2 seconds, FIXME how to advance blockchain time?
  // await root.call(contract, "nft_distribute_after_presale", {})

  // result = await contract.view("nft_presale_distribution", {})
  // t.is(result.length, 3)

  t.pass()
})

test("Call mint new token", async (t) => {
  const { contract } = t.context.accounts

  const account_id = "test.near"
  const token_id = "1"

  const token = {
    metadata: {
      title: "GroundOne PART Token",
      description: "Token ID is your ranking.",
      media:
        "https://bafybeiftczwrtyr3k7a2k4vutd3amkwsmaqyhrdzlhvpt33dyjivufqusq.ipfs.dweb.link/goteam-gif.gif",
    },
    receiver_id: account_id,
  }

  const attachedDeposit = NEAR.parse("1 N").toString()

  await contract.call(contract, "nft_mint", token, {
    attachedDeposit,
  })

  let result = await contract.view("nft_vars", {})

  t.is(result.currentTokenId, 3)
  t.is(result.ownerId, token.receiver_id)
  t.is(result.projectName, constructor_args.projectName)
  t.is(result.totalSupply, constructor_args.totalSupply)
  t.is(result.price, constructor_args.price)
  t.deepEqual(result.reservedTokenIds, {
    length: 1,
    prefix: "reservedTokenIds",
  })
  t.is(result.prelaunchEnd, constructor_args.prelaunchEnd)
  t.is(result.saleEnd, constructor_args.saleEnd)

  result = await contract.view("nft_token", { token_id })

  const { receiver_id, ...tokenWithoutReceiver } = token
  t.deepEqual(result, {
    ...tokenWithoutReceiver,
    approved_account_ids: {},
    owner_id: account_id,
    token_id,
  })

  result = await contract.view("nft_total_supply", {})
  t.is(result, constructor_args.reservedTokenIds.length + 1)

  result = await contract.view("nft_tokens", {})
  t.is(result.length, 2)

  result = await contract.view("nft_tokens_for_owner", { account_id })
  t.deepEqual(result.length, 2)

  result = await contract.view("nft_supply_for_owner", { account_id })
  const tokenSupply = 2
  t.is(result, tokenSupply)
})

test("Call should fail minting when deposit < price", async (t) => {
  const { contract } = t.context.accounts

  const token = {
    metadata: {
      title: "GroundOne PART Token",
      description: "Token ID is your ranking.",
      media:
        "https://bafybeiftczwrtyr3k7a2k4vutd3amkwsmaqyhrdzlhvpt33dyjivufqusq.ipfs.dweb.link/goteam-gif.gif",
    },
    receiver_id: "test.near",
  }

  const attachedDeposit = NEAR.parse("0.0001 N").toString()

  await t.throwsAsync(async () => {
    return contract.call(contract, "nft_mint", token, {
      attachedDeposit,
    })
  })
})

test("Call should fail minting after totalSupply of NFTs is reached", async (t) => {
  const { contract } = t.context.accounts

  const account_id = "test.near"

  const token = {
    metadata: {
      title: "GroundOne PART Token",
      description: "Token ID is your ranking.",
      media:
        "https://bafybeiftczwrtyr3k7a2k4vutd3amkwsmaqyhrdzlhvpt33dyjivufqusq.ipfs.dweb.link/goteam-gif.gif",
    },
    receiver_id: account_id,
  }

  const attachedDeposit = NEAR.parse("1 N").toString()

  await contract.call(contract, "nft_mint", token, {
    attachedDeposit,
  })
  let result = await contract.view("nft_vars", {})
  t.is(result.currentTokenId, 3)
  await contract.call(contract, "nft_mint", token, {
    attachedDeposit,
  })

  result = await contract.view("nft_vars", {})
  t.is(result.currentTokenId, 4)

  await t.throwsAsync(async () => {
    return contract.call(contract, "nft_mint", token, {
      attachedDeposit,
    })
  })
})
