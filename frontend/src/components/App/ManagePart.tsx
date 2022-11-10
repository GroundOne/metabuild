import { useCallback, useContext, useEffect, useState } from 'react';
import Button from '../ui-components/Button';
import { NearContext, WalletState } from '../walletContext';
import { useRouter } from 'next/router';

export default function ManagePart() {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const { wallet, walletState, contract, tokenContract } = useContext(NearContext);
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
                const contract = await tokenContract.contract_vars(contractId);
                const tokens = convertIdsToIdString(contract.reservedTokenIds as number[]);
                // console.log(`Contract info for ${contractId}: ${JSON.stringify(contractInfo)}`);
                const saleOpeningDate = new Date(contract.saleOpening / 1e6);
                const saleCloseDate = new Date(contract.saleClose / 1e6);
                const status =
                    currentDate < contract.saleOpeningDate
                        ? 'Presale'
                        : currentDate < contract.saleCloseDate
                        ? 'Open'
                        : 'Closed';
                ownerContracts.push({ ...contract, tokens, saleOpeningDate, saleCloseDate, status });
            }
            setContracts(ownerContracts);
        };
        loadContracts();
    }, [contract, tokenContract]);

    const handleInitiatePresale = useCallback(
        async (contractId: string) => {
            if (walletState === WalletState.SignedIn) {
                // distribute_after_presale
                await tokenContract.distributeAfterPresale(contractId);
                // cashout_unlucky_presale_participants
                // mint_for_presale_participants
            }
        },
        [tokenContract]
    );

    return (
        <>
            <div className="mr-12 flex justify-between">
                <div className="mb-4 text-lg font-semibold">Your Projects</div>
                <div>
                    <span>As of Date: </span>
                    <input
                        type="date"
                        value={currentDate.toISOString().split('T')[0]}
                        onChange={(e) => setCurrentDate(new Date(e.currentTarget.value || Date.now()))}
                    />
                </div>
            </div>
            {contracts.map((contract) => {
                return (
                    <section
                        className="m2 my-4 mr-12 flex flex-col gap-3 rounded-3xl border border-black py-4 px-6"
                        key={contract.projectAddress}
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
                        <div className="flex justify-end gap-2">
                            <Button
                                size="sm"
                                isInvertedColor
                                className="w-32"
                                onClick={() => handleInitiatePresale(contract.projectAddress)}
                            >
                                Initiate pre-sale
                            </Button>
                            <Button
                                size="sm"
                                isInvertedColor
                                onClick={() =>
                                    router.push(router.pathname + '/distribution?project=' + contract.projectAddress)
                                }
                            >
                                Property Distribution...
                            </Button>
                            <Button
                                size="sm"
                                isInvertedColor
                                className="w-32"
                                onClick={() => {
                                    console.log('clicked');
                                }}
                            >
                                Manage
                            </Button>
                        </div>
                    </section>
                );
            })}
        </>
    );
}
