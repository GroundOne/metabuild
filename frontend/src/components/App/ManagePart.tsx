import { useCallback, useContext, useEffect, useState } from 'react';
import Button from '../ui-components/Button';
import { NearContext } from '../walletContext';

export default function ManagePart() {
    const { contract, tokenContract } = useContext(NearContext);
    const [contracts, setContracts] = useState<any[]>([]);

    useEffect(() => {
        const loadContracts = async () => {
            const ownerContractIDs = await contract.contractsForOwner();
            const ownerContracts = [];
            for await (const contractId of ownerContractIDs) {
                const contractInfo = await tokenContract.contract_vars(contractId);
                ownerContracts.push(contractInfo);
            }
            setContracts(ownerContracts);
        };
        loadContracts();
    }, []);

    return (
        <>
            <div className="mb-4 text-lg font-semibold">Your Projects</div>
            {contracts.map((contract) => {
                return (
                    <section className="m2 my-2 mr-12 flex flex-col gap-3 rounded-3xl border border-black py-4 px-6">
                        <div>
                            Project Name: <span className="font-semibold">{contract.projectName}</span>
                        </div>
                        <div>
                            Reserved Token Ids:
                            <span className="font-semibold"> {JSON.stringify(contract.reservedTokenIds)}</span>
                        </div>
                        <div>
                            Current Token Id: <span className="font-semibold">{contract.currentTokenId}</span>
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
