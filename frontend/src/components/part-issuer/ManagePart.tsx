import { useCallback, useContext, useEffect, useState } from 'react';
import Button from '../ui-components/Button';
import { NearContext, WalletState } from '../walletContext';
import { useRouter } from 'next/router';
import { debounce } from '../../utils/common';
import { ContractVarsParsed } from '../../utils/near-interface';
import constants from '../../constants';

export default function ManagePart() {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const { wallet, walletState, contract, tokenContract } = useContext(NearContext);
    const [contracts, setContracts] = useState<ContractVarsParsed[]>([]);

    const userLocale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

    const getContracts = async (forDate: Date) => {
        const ownerContractIDs: string[] = await contract.contractsForOwner(wallet.accountId!);
        console.log('ownerContractIDs', ownerContractIDs);

        const contractsPromise = ownerContractIDs.map(async (contractId: string) => {
            return tokenContract.contract_vars(contractId, forDate);
        });
        const ownerContracts = await Promise.all(contractsPromise);
        const availableContracts = ownerContracts
            .filter((contract) => !contract.isArchived)
            .filter(
                (contract) =>
                    ![
                        'demo_project_test.part_factory.groundone.testnet',
                        'demo_project_test_12.part_factory.groundone.testnet',
                        'test_1.part_factory.groundone.testnet',
                    ].includes(contract.projectAddress)
            );
        console.log('ownerContractss', ownerContracts);
        console.log('availableContracts', availableContracts);
        setContracts(availableContracts);
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
        async (contractId: string, projectName: string, price: string) => {
            if (walletState === WalletState.SignedIn) {
                await tokenContract.postPresaleProceedToSale(contractId, projectName, price);
            }
        },
        [tokenContract, walletState]
    );

    const handleArchiveContract = useCallback(
        async (contractId: string) => {
            if (walletState === WalletState.SignedIn) {
                if (
                    confirm(
                        'Are you sure you want to archive this project? If you proceed you will loose access to this project forever.'
                    ) == true
                ) {
                    await tokenContract.archiveContract(contractId);
                    console.log('archiving contract', contractId);
                } else {
                    console.log('NOT archiving contract', contractId);
                }
            }
        },
        [tokenContract, walletState]
    );

    const handlePropertyDistribution = (contractId: string) => {
        if (walletState === WalletState.SignedIn) {
            tokenContract.distributed_properties(contractId);
        }
    };

    const handlePayout = () => {
        if (walletState === WalletState.SignedIn) {
            tokenContract.payoutNear({ contractId: wallet.accountId! });
        }
    };

    return (
        <>
            <div className="mr-12 flex justify-between">
                <div className="mb-4 text-lg font-semibold">Your Projects</div>
                {/* <div>
                    <span>As of Date: </span>
                    <input
                        className="rounded-full"
                        type="date"
                        value={currentDate.toISOString().split('T')[0]}
                        onChange={(e) => setCurrentDate(new Date(e.currentTarget.value || Date.now()))}
                    />
                </div> */}
            </div>
            {contracts.map((contract) => {
                return (
                    <section
                        className="m2 relative my-4 mr-12 flex flex-col gap-3 rounded-3xl border border-black py-4 px-6"
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
                            PARTs sold: <span className="font-semibold">{contract.soldTokens}</span>
                        </div>
                        <div>
                            Sale Opening:{' '}
                            <span className="font-semibold">
                                {contract.saleOpeningDate.toLocaleString(userLocale, {
                                    timeZoneName: 'short',
                                })}
                            </span>
                        </div>
                        <div>
                            Sale Close:{' '}
                            <span className="font-semibold">
                                {contract.saleCloseDate.toLocaleString(userLocale, {
                                    timeZoneName: 'short',
                                })}
                            </span>
                        </div>
                        <div>
                            Contract Status: <span className="font-semibold">{contract.contractStatus}</span>
                        </div>
                        {/* <div className="bg-yellow-500">
                            <i>
                                Calculated Status: <span className="font-semibold">{contract.status}</span>
                            </i>
                        </div> */}
                        <div
                            onClick={() => handleArchiveContract(contract.projectAddress)}
                            className="absolute top-3 right-3 w-8 cursor-pointer rounded-full border border-gray-300 bg-slate-100 py-1 text-center text-xs hover:bg-slate-300"
                        >
                            X
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
                                Project Info
                            </Button>
                            <Button
                                isDisabled={
                                    !(contract.contractStatus === 'presale' && contract.saleOpeningDate < currentDate)
                                }
                                size="sm"
                                isInvertedColor
                                className="w-32"
                                onClick={() =>
                                    handlePostPresaleProceedToSale(
                                        contract.projectAddress,
                                        contract.projectName,
                                        contract.price
                                    )
                                }
                            >
                                Proceed to sale
                            </Button>
                            <Button
                                // isDisabled={
                                //     !(contract.contractStatus === 'presale' && contract.saleOpeningDate < currentDate)
                                // }
                                size="sm"
                                isInvertedColor
                                className="w-32"
                                onClick={() => handlePayout()}
                            >
                                Payout
                            </Button>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                isDisabled={
                                    !(contract.contractStatus === 'sale' && contract.saleCloseDate < currentDate)
                                }
                                size="sm"
                                isInvertedColor
                                onClick={() =>
                                    router.push(router.pathname + '/initialisation?project=' + contract.projectAddress)
                                }
                            >
                                Property Initialisation...
                            </Button>
                            <Button
                                isDisabled={
                                    !(
                                        contract.contractStatus === 'property_selection' &&
                                        contract.distributionStartDate &&
                                        contract.distributionStartDate < currentDate
                                    )
                                }
                                size="sm"
                                isInvertedColor
                                onClick={() => handlePropertyDistribution(contract.projectAddress)}
                            >
                                Property Distribution
                            </Button>
                        </div>
                    </section>
                );
            })}
        </>
    );
}
