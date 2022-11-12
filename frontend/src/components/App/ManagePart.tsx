import { useCallback, useContext, useEffect, useState } from 'react';
import Button from '../ui-components/Button';
import { NearContext, WalletState } from '../walletContext';
import { useRouter } from 'next/router';
import { debounce } from '../../utils/common';
import { ContractVarsParsed } from '../../utils/near-interface';

export default function ManagePart() {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const { walletState, contract, tokenContract } = useContext(NearContext);
    const [contracts, setContracts] = useState<ContractVarsParsed[]>([]);

    const locale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

    const getContracts = async (forDate: Date) => {
        const ownerContractIDs: string[] = await contract.contractsForOwner();
        console.log('ownerContractIDs', ownerContractIDs);

        const contractsPromise = ownerContractIDs.map(async (contractId: string) => {
            return tokenContract.contract_vars(contractId, forDate);
        });
        const ownerContracts = await Promise.all(contractsPromise);
        setContracts(ownerContracts);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadContracts = useCallback(
        debounce(getContracts, 400),
        // add function dependencies in the useEffect hook for loadContracts() otherwise debounce will not work
        []
    );

    useEffect(() => {
        loadContracts(currentDate);
    }, [contract, tokenContract, currentDate, loadContracts]);

    const handlePostPresaleProceedToSale = useCallback(
        async (contractId: string) => {
            if (walletState === WalletState.SignedIn) {
                await tokenContract.distributeAfterPresale(contractId);
            }
        },
        [tokenContract, walletState]
    );

    return (
        <>
            <div className="mr-12 flex justify-between">
                <div className="mb-4 text-lg font-semibold">Your Projects</div>
                <div>
                    <span>As of Date: </span>
                    <input
                        className="rounded-full"
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
                            <span className="font-semibold"> {contract.reservedTokens}</span>
                        </div>
                        <div>
                            PARTs sold: <span className="font-semibold">{contract.currentTokenId - 1}</span>
                        </div>
                        <div>
                            Sale Opening:{' '}
                            <span className="font-semibold">{contract.saleOpeningDate.toLocaleDateString(locale)}</span>
                        </div>
                        <div>
                            Sale Close:{' '}
                            <span className="font-semibold">{contract.saleCloseDate.toLocaleDateString(locale)}</span>
                        </div>
                        <div>
                            Contract Status: <span className="font-semibold">{contract.contractStatus}</span>
                        </div>
                        <div className="bg-yellow-500">
                            <i>
                                Calculated Status: <span className="font-semibold">{contract.status}</span>
                            </i>
                        </div>
                        {/* 'Presale' | 'PostPresale_Distribution' | 'PostPresale_ProceedToSale' | 'Sale'  */}
                        <div className="flex justify-end gap-2">
                            <Button
                                size="sm"
                                isInvertedColor
                                className="w-32"
                                onClick={() =>
                                    router.push(
                                        router.pathname + '/part-sale-statistics?project=' + contract.projectAddress
                                    )
                                }
                            >
                                PART Sale
                            </Button>
                            <Button
                                isDisabled={!(contract.status === 'PostPresale_Distribution')}
                                size="sm"
                                isInvertedColor
                                onClick={() =>
                                    router.push(router.pathname + '/distribution?project=' + contract.projectAddress)
                                }
                            >
                                Property Distribution...
                            </Button>
                            <Button
                                isDisabled={!(contract.status === 'PostPresale_ProceedToSale')}
                                size="sm"
                                isInvertedColor
                                className="w-32"
                                onClick={() => handlePostPresaleProceedToSale(contract.projectAddress)}
                            >
                                Proceed to sale
                            </Button>
                        </div>
                    </section>
                );
            })}
        </>
    );
}
