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
    const base64args = transactionJson.result.transaction.actions[0].FunctionCall.args;
    const args = JSON.parse(atob(base64args)).args;
    console.log(args);
    console.log(args.projectName);
    return args.projectAddress + '.part_factory.groundone.testnet';
}

export const debounce = (func: Function, delay = 1000) => {
    let firstCall = true;
    let debounceTimer: NodeJS.Timeout;
    return function (...args: any): any {
        // @ts-ignore
        const context = this;
        if (firstCall) {
            firstCall = false;
            return func.apply(context, args);
        }
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};

export const convertPropertyIdsToIdString = (ids: string[]) => {
    if (!ids!.length) return '';
    return ids
        .map((value) => +value)
        .sort((a, b) => a - b)
        .reduce((acc: number[][], cur, i) => {
            if (i === 0) {
                return [...acc, [cur]];
            }
            const last = acc[acc.length - 1];
            if (cur === last[last.length - 1] + 1) {
                const lastItems = last.length > 1 ? last.slice(0, -1) : last;
                return [...acc.slice(0, -1), [...lastItems, cur]];
            } else {
                return [...acc, [cur]];
            }
        }, [])
        .map((token) =>
            token.length > 1
                ? token[0] === token[1] - 1
                    ? token.join('; ')
                    : `${token[0]}-${token[token.length - 1]}`
                : token[0]
        )
        .join('; ');
};

export const convertPropertiesStringToIds = (properties?: string) => {
    return (properties ?? '')
        .replace(/\s+/g, '') // remove spaces
        .split(';')
        .flatMap((range) => {
            const [from, to] = range.split('-').map((num) => parseInt(num, 10));
            return to ? Array.from({ length: to - from + 1 }, (_, i) => from + i) : [from];
        })
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((a, b) => a - b)
        .map((value) => value.toString());
};
