#/bin/bash
case "$1" in
"clean")
   echo 'clean'
   ;;
"setup")
   echo 'setup'
   ;;
"distribute")
   echo 'distribute'
   ;;
"subacc:create")
   echo 'subacc:create'
   ;;
"subacc:send")
   echo 'subacc:send'
   ;;
"subacc:state")
   echo 'subacc:state'
   ;;
"subacc:delete")
   echo 'subacc:delete'
   ;;
"build:deploy")
   echo 'build:deploy'
   ;;
"build")
   echo 'build'
   ;;
"build:part")
   echo 'build:part'
   ;;
"deploy")
   echo 'deploy'
   ;;
"deploy:part")
   echo 'deploy:part'
   ;;
"deploy:part:dev")
   echo 'deploy:part:dev'
   ;;
"call:init:presale")
   echo 'call:init:presale'
   ;;
"call:init")
   echo 'call:init'
   ;;
"call:presale:participate")
   echo 'call:presale:participate'
   ;;
"call:presale:participate2")
   echo 'call:presale:participate2'
   ;;
"call:presale:distribute")
   echo 'call:presale:distribute'
   ;;
"view:presale:participants")
   echo 'view:presale:participants'
   ;;
"view:presale:distribution")
   echo 'view:presale:distribution'
   ;;
"view:meta")
   echo 'view:meta'
   ;;
"view:vars")
   echo 'view:vars'
   ;;
"view:blocktime")
   echo 'view:blocktime'
   ;;

"view:done:presale")
   echo 'view:done:presale'
   ;;

"view:done:sale")
   echo 'view:done:sale'
   ;;

"call:mint")
   echo 'call:mint'
   ;;

"view:token")
   echo 'view:token'
   ;;

"view:tokens")
   echo 'view:tokens'
   ;;

"test")
   echo 'test'
   ;;

"test:watch")
   echo 'test:watch'
   ;;

"build:test")
   echo 'build:test'
   ;;

*)
   echo "You have failed to specify what to do correctly."
   exit 1
   ;;
esac

# "clean": "yarn subacc:delete && yarn subacc:create && yarn subacc:send && yarn build:deploy",
# "setup": "yarn call:init:presale && view:presale:participants",
# "distribute": "yarn call:presale:distribute && yarn view:presale:distribution",
# "subacc:create": "source .env && yarn near create-account $PART_CONTRACT_ID --masterAccount $MAIN_ACCOUNT --initialBalance 2",
# "subacc:send": "source .env && yarn near send $MAIN_ACCOUNT $PART_CONTRACT_ID 4",
# "subacc:state": "source .env && yarn near state $PART_CONTRACT_ID",
# "subacc:delete": "source .env && yarn near delete $PART_CONTRACT_ID $MAIN_ACCOUNT",
# "build:deploy": "yarn build && yarn deploy:part",
# "build": "yarn build:part",
# "build:part": "near-sdk-js build src/part-contract/index.ts build/part.wasm",
# "deploy": "yarn deploy:part",
# "deploy:part": "source .env && near deploy --accountId $PART_CONTRACT_ID --wasmFile build/part.wasm",
# "deploy:part:dev": "near dev-deploy build/part.wasm",
# "call:init:presale": "yarn call:init && yarn call:presale:participate && call:presale:participate2",
# "call:init": "source .env && near call $PART_CONTRACT_ID init '{\"ownerId\": \"'$PART_CONTRACT_ID'\", \"projectName\": \"GroundOne Part\", \"totalSupply\": 3, \"price\": \"1000000000000000000000\", \"reservedTokenIds\": [\"2\"]}' --accountId $PART_CONTRACT_ID --depositYocto 8880000000000000000000",
# "call:presale:participate": "source .env && near call $PART_CONTRACT_ID nft_participate_presale --accountId $PART_CONTRACT_ID --depositYocto 8880000000000000000000",
# "call:presale:participate2": "source .env && near call $PART_CONTRACT_ID nft_participate_presale --accountId $MAIN_ACCOUNT --depositYocto 8880000000000000000000",
# "call:presale:distribute": "source .env && near call $PART_CONTRACT_ID nft_distribute_after_presale --accountId $PART_CONTRACT_ID",
# "view:presale:participants": "source .env && near view $PART_CONTRACT_ID nft_presale_participants",
# "view:presale:distribution": "source .env && near view $PART_CONTRACT_ID nft_presale_distribution",
# "view:meta": "source .env && near view $PART_CONTRACT_ID nft_metadata",
# "view:vars": "source .env && near view $PART_CONTRACT_ID nft_vars",
# "view:blocktime": "source .env && near view $PART_CONTRACT_ID nft_current_block_time",
# "view:done:presale": "source .env && near view $PART_CONTRACT_ID nft_isPresaleDone",
# "view:done:sale": "source .env && near view $PART_CONTRACT_ID nft_isSaleDone",
# "call:mint": "source .env && near call $PART_CONTRACT_ID nft_mint '{\"metadata\": {\"title\": \"GroundOne PART Token\", \"description\": \"Token ID is your ranking.\", \"media\": \"https://bafybeiftczwrtyr3k7a2k4vutd3amkwsmaqyhrdzlhvpt33dyjivufqusq.ipfs.dweb.link/goteam-gif.gif\"}, \"receiver_id\": \"'$MAIN_ACCOUNT'\"}' --accountId $MAIN_ACCOUNT --amount 0.018",
# "view:token": "source .env && near view $PART_CONTRACT_ID nft_token '{\"token_id\": \"1\"}'",
# "view:tokens": "source .env && near view $PART_CONTRACT_ID nft_tokens",
# "test": "ava",
# "test:watch": "nodemon --exec 'yarn test' -w ./__tests__ -w ./src -e js,ts",
# "build:test": "yarn build && yarn test",
