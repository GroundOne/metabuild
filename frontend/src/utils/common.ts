import constants from '../constants';

export type DistributionVars = {
    totalSupply: number;
    distributionStart: string;
    reservedTokenIds: string[];
    reservedTokens: string;
    distributionStartDate: Date;
};

const NEAR_RPC_ENDPOINT = 'https://archival-rpc.testnet.near.org';
// const NEAR_RPC_ENDPOINT = 'https://rpc.testnet.near.org';

async function getNearTransactionData(transactionHash: string) {
    const transactionData = await fetch(NEAR_RPC_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'dontcare',
            method: 'tx',
            params: [transactionHash, 'frangiskos.testnet'],
        }),
    });
    const transactionJson = await transactionData.json();
    console.log('transactionJson', transactionJson);
    const base64args = transactionJson.result.transaction.actions[0].FunctionCall.args;
    const data = JSON.parse(atob(base64args));
    console.log('testnet.near.org', data);
    return data;
}

export async function getContractIdFromTransactionId(transactionHash: string): Promise<string | null> {
    try {
        const transactionData = await getNearTransactionData(transactionHash);
        return transactionData.args.projectAddress + constants.CONTRACT_ADDRESS_SUFFIX;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

export async function getPropertyDistributionFromTransactionId(
    transactionHash: string
): Promise<DistributionVars | null> {
    try {
        const transactionData = await getNearTransactionData(transactionHash);
        transactionData.reservedTokens = convertPropertyIdsToIdString(transactionData.reservedTokenIds ?? []);
        transactionData.distributionStartDate = new Date(+transactionData.distributionStart / 1e6);
        return transactionData;
    } catch (error) {
        console.log('error', error);
        return null;
    }
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
