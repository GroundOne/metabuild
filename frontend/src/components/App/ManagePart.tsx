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

        const contractsPromise = ownerContractIDs
            // TODO: Check why this contract is giving error
            .filter((contractId) => contractId !== 'demo_old.part_factory.groundone.testnet')
            .map(async (contractId: string) => {
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

    const handleInitiatePresale = useCallback(
        async (contractId: string) => {
            if (walletState === WalletState.SignedIn) {
                // distribute_after_presale
                await tokenContract.distributeAfterPresale(contractId);
                // cashout_unlucky_presale_participants
                // mint_for_presale_participants
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
                        <div>
                            Calculated Status: <span className="font-semibold">{contract.status}</span>
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
