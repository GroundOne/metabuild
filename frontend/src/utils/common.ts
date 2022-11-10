export async function getContractIdFromTransactionId(transactionId: string): Promise<string> {
    const transactionData = await fetch('https://archival-rpc.testnet.near.org', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'dontcare',
            method: 'tx',
            params: [transactionId, 'frangiskos.testnet'],
        }),
    });
    const transactionJson = await transactionData.json();
    console.log('transactionJson', transactionJson);
    // return transactionJson.result.transaction.actions[0].FunctionCall.method_name;
    const base64args = transactionJson.result.transaction.actions[0].FunctionCall.args;
    const args = JSON.parse(atob(base64args)).args;
    console.log(args);
    console.log(args.projectName);
    return args.projectName;

    // projectAddress
}

let test = {
    jsonrpc: '2.0',
    result: {
        receipts_outcome: [
            {
                block_hash: 'FDbyXrV7mmB8m3yABwmyeXvSzTdhry3N4ku537yWYNp2',
                id: 'FE2subFTjTxznXgyT8qFo3KwcBCH9BtsQdnenzD9DqyE',
                outcome: {
                    executor_id: 'part_factory.groundone.testnet',
                    gas_burnt: 15259810169951,
                    logs: [],
                    metadata: {
                        gas_profile: [
                            {
                                cost: 'ADD_KEY',
                                cost_category: 'ACTION_COST',
                                gas_used: '203530250000',
                            },
                            {
                                cost: 'CREATE_ACCOUNT',
                                cost_category: 'ACTION_COST',
                                gas_used: '99607375000',
                            },
                            {
                                cost: 'DEPLOY_CONTRACT',
                                cost_category: 'ACTION_COST',
                                gas_used: '3975211808645',
                            },
                            {
                                cost: 'FUNCTION_CALL',
                                cost_category: 'ACTION_COST',
                                gas_used: '2320241608780',
                            },
                            {
                                cost: 'NEW_RECEIPT',
                                cost_category: 'ACTION_COST',
                                gas_used: '108059500000',
                            },
                            {
                                cost: 'TRANSFER',
                                cost_category: 'ACTION_COST',
                                gas_used: '115123062500',
                            },
                            {
                                cost: 'BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '15091782327',
                            },
                            {
                                cost: 'CONTRACT_LOADING_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '35445963',
                            },
                            {
                                cost: 'CONTRACT_LOADING_BYTES',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '167382586500',
                            },
                            {
                                cost: 'PROMISE_RETURN',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '560152386',
                            },
                            {
                                cost: 'READ_CACHED_TRIE_NODE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '364800000000',
                            },
                            {
                                cost: 'READ_MEMORY_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '70466306400',
                            },
                            {
                                cost: 'READ_MEMORY_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '2117536348983',
                            },
                            {
                                cost: 'READ_REGISTER_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '32723147418',
                            },
                            {
                                cost: 'READ_REGISTER_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '72344508',
                            },
                            {
                                cost: 'STORAGE_READ_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '338141074500',
                            },
                            {
                                cost: 'STORAGE_READ_KEY_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '3095253300',
                            },
                            {
                                cost: 'STORAGE_READ_VALUE_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '1032424920',
                            },
                            {
                                cost: 'STORAGE_WRITE_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '385180416000',
                            },
                            {
                                cost: 'STORAGE_WRITE_EVICTED_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '3886194147',
                            },
                            {
                                cost: 'STORAGE_WRITE_KEY_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '6061526562',
                            },
                            {
                                cost: 'STORAGE_WRITE_VALUE_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '6141670722',
                            },
                            {
                                cost: 'TOUCHING_TRIE_NODE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '547466501484',
                            },
                            {
                                cost: 'UTF8_DECODING_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '3111779061',
                            },
                            {
                                cost: 'UTF8_DECODING_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '11663219160',
                            },
                            {
                                cost: 'WASM_INSTRUCTION',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '1847354615700',
                            },
                            {
                                cost: 'WRITE_MEMORY_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '42056922915',
                            },
                            {
                                cost: 'WRITE_MEMORY_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '2086409352',
                            },
                            {
                                cost: 'WRITE_REGISTER_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '40117314804',
                            },
                            {
                                cost: 'WRITE_REGISTER_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '3128687172',
                            },
                        ],
                        version: 1,
                    },
                    receipt_ids: [
                        'HzejfuxmQsXDitPchsrVNnsxvXvTMAzaRdb4DvRAsgzt',
                        '95PEpFPJabaTCgga2ac254NrYjcua6JhSN5PaF9t9hoP',
                    ],
                    status: {
                        SuccessReceiptId: 'HzejfuxmQsXDitPchsrVNnsxvXvTMAzaRdb4DvRAsgzt',
                    },
                    tokens_burnt: '1525981016995100000000',
                },
                proof: [
                    {
                        direction: 'Left',
                        hash: 'E1sKea1ybu8bmCvCvci38fAwmwYjzVGjtYBVBKGjHQt6',
                    },
                ],
            },
            {
                block_hash: 'GP38E77C41EvKuAXjjGUxassf7RkALayRGdcAR7wKukf',
                id: 'HzejfuxmQsXDitPchsrVNnsxvXvTMAzaRdb4DvRAsgzt',
                outcome: {
                    executor_id: 'ff_demo_b.part_factory.groundone.testnet',
                    gas_burnt: 50177262063615,
                    logs: ['Sale status is presale'],
                    metadata: {
                        gas_profile: [
                            {
                                cost: 'BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '2118144888',
                            },
                            {
                                cost: 'CONTRACT_LOADING_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '35445963',
                            },
                            {
                                cost: 'CONTRACT_LOADING_BYTES',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '120589946250',
                            },
                            {
                                cost: 'LOG_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '3543313050',
                            },
                            {
                                cost: 'LOG_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '290373402',
                            },
                            {
                                cost: 'READ_CACHED_TRIE_NODE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '27360000000',
                            },
                            {
                                cost: 'READ_MEMORY_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '10439452800',
                            },
                            {
                                cost: 'READ_MEMORY_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '4839096909',
                            },
                            {
                                cost: 'READ_REGISTER_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '2517165186',
                            },
                            {
                                cost: 'READ_REGISTER_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '16361292',
                            },
                            {
                                cost: 'STORAGE_READ_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '56356845750',
                            },
                            {
                                cost: 'STORAGE_READ_KEY_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '154762665',
                            },
                            {
                                cost: 'STORAGE_WRITE_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '64196736000',
                            },
                            {
                                cost: 'STORAGE_WRITE_KEY_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '352414335',
                            },
                            {
                                cost: 'STORAGE_WRITE_VALUE_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '38494006899',
                            },
                            {
                                cost: 'TOUCHING_TRIE_NODE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '64407823704',
                            },
                            {
                                cost: 'UTF8_DECODING_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '3111779061',
                            },
                            {
                                cost: 'UTF8_DECODING_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '6414770538',
                            },
                            {
                                cost: 'WASM_INSTRUCTION',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '10808463296400',
                            },
                            {
                                cost: 'WRITE_MEMORY_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '2803794861',
                            },
                            {
                                cost: 'WRITE_MEMORY_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '452146152',
                            },
                            {
                                cost: 'WRITE_REGISTER_BASE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '2865522486',
                            },
                            {
                                cost: 'WRITE_REGISTER_BYTE',
                                cost_category: 'WASM_HOST_COST',
                                gas_used: '631059624',
                            },
                        ],
                        version: 1,
                    },
                    receipt_ids: ['E2MExN8b7THLif12TWxU5At79DxtW4upckDT7y1g8EHK'],
                    status: {
                        SuccessValue: '',
                    },
                    tokens_burnt: '5017726206361500000000',
                },
                proof: [
                    {
                        direction: 'Right',
                        hash: '8URqiPR6pHryFEz5esr9wSwEuYp3vmhet6kuzqSjv3nw',
                    },
                    {
                        direction: 'Left',
                        hash: 'ECNYbJ5vTYiEhf7RAc4VHC9mnKeQNAoJbFi9KkuCajWB',
                    },
                ],
            },
            {
                block_hash: 'Hqitqwu2pYWgTmfz43bkEKQTXbrjAtGAzYtm8Av6EE61',
                id: 'E2MExN8b7THLif12TWxU5At79DxtW4upckDT7y1g8EHK',
                outcome: {
                    executor_id: 'frangiskos.testnet',
                    gas_burnt: 223182562500,
                    logs: [],
                    metadata: {
                        gas_profile: [],
                        version: 1,
                    },
                    receipt_ids: [],
                    status: {
                        SuccessValue: '',
                    },
                    tokens_burnt: '0',
                },
                proof: [],
            },
            {
                block_hash: 'GP38E77C41EvKuAXjjGUxassf7RkALayRGdcAR7wKukf',
                id: '95PEpFPJabaTCgga2ac254NrYjcua6JhSN5PaF9t9hoP',
                outcome: {
                    executor_id: 'frangiskos.testnet',
                    gas_burnt: 223182562500,
                    logs: [],
                    metadata: {
                        gas_profile: [],
                        version: 1,
                    },
                    receipt_ids: [],
                    status: {
                        SuccessValue: '',
                    },
                    tokens_burnt: '0',
                },
                proof: [
                    {
                        direction: 'Left',
                        hash: 'FA9uyCzmQVvw3MuADiS97s2YbjaGnP36kRqBpbu1FWLA',
                    },
                    {
                        direction: 'Left',
                        hash: 'ECNYbJ5vTYiEhf7RAc4VHC9mnKeQNAoJbFi9KkuCajWB',
                    },
                ],
            },
        ],
        status: {
            SuccessValue: '',
        },
        transaction: {
            actions: [
                {
                    FunctionCall: {
                        args: 'eyJhcmdzIjp7Im93bmVySWQiOiJmcmFuZ2lza29zLnRlc3RuZXQiLCJwcm9qZWN0TmFtZSI6ImZmX2RlbW9fYiIsInRvdGFsU3VwcGx5IjoiMTAwIiwicHJpY2UiOiIwLjAwMSIsInJlc2VydmVkVG9rZW5JZHMiOlsiMSIsIjIiLCIzIiwiNCIsIjUiLCI2IiwiNyIsIjgiLCI5IiwiMTAiLCIyMCIsIjIxIiwiMjIiLCIyMyIsIjI0IiwiMjUiLCIyNiIsIjI3IiwiMjgiLCIyOSIsIjMwIiwiNDAiLCI1MCJdLCJyZXNlcnZlZFRva2VuT3duZXIiOiJncm91bmRvbmUudGVzdG5ldCIsInNhbGVPcGVuaW5nIjoiMTY2NzI4OTYwMDAwMCIsInNhbGVDbG9zZSI6IjE2Njc3MjE2MDAwMDAiLCJtZXRhZGF0YSI6eyJzcGVjIjoibmZ0LTEuMC4wIiwibmFtZSI6ImZmX2RlbW9fYiIsInN5bWJvbCI6ImZmX2RlbW9fYiJ9fX0=',
                        deposit: '6000000000000000000000000',
                        gas: 300000000000000,
                        method_name: 'create_token',
                    },
                },
            ],
            hash: 'EBz4gvA9v4ezc59ZnvyfEBUB9ZsXskrxcA2x5aS84G3G',
            nonce: 101786375000030,
            public_key: 'ed25519:GqRL964ceMa1RPHU7DyGwS6svArSgRTPsfe2UuDfszU8',
            receiver_id: 'part_factory.groundone.testnet',
            signature:
                'ed25519:47E6ySELk3nyY3mv8yumABdKKnjen9KCR71311acsY4ywntLmYd3rqauyXcNZpyaGu4njp9Re9w3dNShJc3evBVt',
            signer_id: 'frangiskos.testnet',
        },
        transaction_outcome: {
            block_hash: 'HA2aAtGymP2ZjgCcePqksD4z5BXban95qxJ3mpkxv42U',
            id: 'EBz4gvA9v4ezc59ZnvyfEBUB9ZsXskrxcA2x5aS84G3G',
            outcome: {
                executor_id: 'frangiskos.testnet',
                gas_burnt: 2428844440742,
                logs: [],
                metadata: {
                    gas_profile: null,
                    version: 1,
                },
                receipt_ids: ['FE2subFTjTxznXgyT8qFo3KwcBCH9BtsQdnenzD9DqyE'],
                status: {
                    SuccessReceiptId: 'FE2subFTjTxznXgyT8qFo3KwcBCH9BtsQdnenzD9DqyE',
                },
                tokens_burnt: '242884444074200000000',
            },
            proof: [
                {
                    direction: 'Left',
                    hash: '65uNmY1kKSw5oWXNgvhBoJwu9fwK8JUNsPsxKoH9LtYv',
                },
                {
                    direction: 'Right',
                    hash: '74jn34nDnDpcXVqHUHNWM3TzaMwLn84Xjj1Sm8Skf9Wg',
                },
                {
                    direction: 'Right',
                    hash: 'G92rqBQU1faapraJTvrfxwTL1eWppp98EEMkiruEstvS',
                },
            ],
        },
    },
    id: 'dontcare',
};
