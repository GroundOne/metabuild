const nearAPI = require("near-api-js")

const dotenv = require("dotenv")
dotenv.config()

function getKeyStore() {
  const { keyStores } = nearAPI
  const homedir = require("os").homedir()
  const CREDENTIALS_DIR = ".near-credentials"
  const credentialsPath = require("path").join(homedir, CREDENTIALS_DIR)
  const myKeyStore = new keyStores.UnencryptedFileSystemKeyStore(
    credentialsPath
  )

  return myKeyStore
}

async function getConnection(myKeyStore) {
  const { connect } = nearAPI

  const connectionConfig = {
    networkId: "testnet",
    keyStore: myKeyStore, // first create a key store
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  }
  const nearConnection = await connect(connectionConfig)

  return nearConnection
}

async function main() {
  const contract = process.env.PART_CONTRACT

  const keyStore = getKeyStore()
  const nearConnection = await getConnection(keyStore)

  const accountToDelete = "subacc.account.testnet"
  const account = await nearConnection.account(accountToDelete)

  console.log("account", account)

  // await account.deleteAccount("groundone.testnet")
}

main()
