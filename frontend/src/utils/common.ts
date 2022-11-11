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

export const debounce = (func: Function, delay: number) => {
    let firstCall = true;
    let debounceTimer: NodeJS.Timeout;
    return function () {
        // @ts-ignore
        const context = this;
        const args = arguments;
        if (firstCall) {
            func.apply(context, args);
            firstCall = false;
            return;
        }
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};
