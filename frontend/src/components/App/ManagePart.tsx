import { useCallback, useContext, useEffect, useState } from 'react';
import Button from '../ui-components/Button';
import { NearContext } from '../walletContext';

export default function ManagePart() {
    const { contract, tokenContract } = useContext(NearContext);
    const [contracts, setContracts] = useState<any[]>([]);

    const convertIdsToIdString = (ids: number[]) => {
        if (!ids!.length) return '';
        return ids
            .map((value) => +value)
            .sort((a, b) => a - b)
            .reduce((acc: number[][], cur, i, array) => {
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

    useEffect(() => {
        const loadContracts = async () => {
            const ownerContractIDs = await contract.contractsForOwner();
            const ownerContracts = [];
            for await (const contractId of ownerContractIDs) {
                const contractInfo = await tokenContract.contract_vars(contractId);
                contractInfo.tokens = convertIdsToIdString(contractInfo.reservedTokenIds as number[]);
                console.log(`Contract info for ${contractId}: ${JSON.stringify(contractInfo)}`);
                ownerContracts.push(contractInfo);
            }
            setContracts(ownerContracts);
        };
        loadContracts();
    }, [contract, tokenContract]);

    return (
        <>
            <div className="mb-4 text-lg font-semibold">Your Projects</div>
            {contracts.map((contract) => {
                return (
                    <section
                        className="m2 my-4 mr-12 flex flex-col gap-3 rounded-3xl border border-black py-4 px-6"
                        key={contract.projectName}
                    >
                        <div>
                            Project Name: <span className="font-semibold">{contract.projectName}</span>
                        </div>
                        <div>
                            Project Address: <span className="font-semibold">{contract.projectAddress}</span>
                        </div>
                        <div>
                            Reserved Token Ids:
                            <span className="font-semibold"> {contract.tokens}</span>
                        </div>
                        <div>
                            PARTs sold: <span className="font-semibold">{contract.currentTokenId - 1}</span>
                        </div>
                        <div>
                            Sale Opening:{' '}
                            <span className="font-semibold">
                                {new Date(contract.saleOpening / 1e6).toLocaleString()}
                            </span>
                        </div>
                        <div>
                            Sale Close:{' '}
                            <span className="font-semibold">{new Date(contract.saleClose / 1e6).toLocaleString()}</span>
                        </div>
                        <div>
                            Contract Status: <span className="font-semibold">{contract.contractStatus}</span>
                        </div>
                    </section>
                );
            })}
        </>
    );
}
