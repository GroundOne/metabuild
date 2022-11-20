import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { getPropertyInitialisationFromTransactionId, InitialisationVars } from '../../utils/common';
import { ContractVarsParsed } from '../../utils/near-interface';
import Modal from '../ui-components/Modal';
import { NearContext, WalletState } from '../walletContext';
import PropertyDistributionForm from './PropertyDistributionForm';
import PropertyDistributionReceipt from './PropertyDistributionReceipt';

export default function PropertyDistribution() {
    const { walletState, tokenContract } = useContext(NearContext);

    const router = useRouter();
    const urlParams = router.query;
    const [contractVars, setContractVars] = useState<null | ContractVarsParsed>(null);
    const [distributionVars, setDistributionVars] = useState<null | {
        transactionHash: string;
        data: InitialisationVars;
    }>(null);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // http://localhost:3000/part-issuer/manage-part/distribution?project=project_completed.part_factory.groundone.testnet&transactionHashes=C1kx4wdQWV9Wo5eRcpUDNvZjnTSXacGs1dNjDVQv1Jwd

    // Handle redirect after property distribution
    useEffect(() => {
        setErrorMessage(null);

        const urlParams = router.query;
        // if (urlParams.transactionHashes) {
        if (urlParams.transactionHashes || urlParams.errorCode) {
            // callback from deploy contract

            if (urlParams.errorCode) {
                // error callback
                // http://localhost:3000/part-issuer/manage-part/distribution?project=demo_project_test15.part_factory.groundone.testnet&errorCode=Error&errorMessage=%257B%2522index%2522%253A0%252C%2522kind%2522%253A%257B%2522ExecutionError%2522%253A%2522Smart%2520contract%2520panicked%253A%2520assertion%2520failed%253A%2520Sale%2520has%2520to%2520be%2520finis
                const errorMessage = decodeURIComponent(urlParams.errorMessage as string) ?? 'Unknown error';
                setErrorMessage(errorMessage);
            } else {
                const contractId = contractVars?.projectAddress;
                console.log('contractId', contractId);
                getPropertyInitialisationFromTransactionId(urlParams.transactionHashes as string).then((data) => {
                    setDistributionVars({ transactionHash: urlParams.transactionHashes as string, data: data! });
                });
                // success callback
                //http://localhost:3000/part-issuer/manage-part/distribution?project=project_completed.part_factory.groundone.testnet&transactionHashes=F8HKgZ9gTTR3YQgj3psadCqKTBeMrgqLeH6X3dsePuek
            }
        }
    }, [contractVars?.projectAddress, router.query]);

    useEffect(() => {
        if (urlParams.project) {
            tokenContract
                .contract_vars(urlParams.project as string)
                .then((contractInfo) => setContractVars(contractInfo));
        }
    }, [urlParams.project, tokenContract]);

    const onPropertyDistribution = () => {
        if (walletState === WalletState.SignedIn) {
            tokenContract.distributed_properties(contractVars!.projectAddress);
        }
    };

    const handleCloseModal = () => {
        setErrorMessage(null);
        router.replace(router.pathname.slice(0, router.pathname.lastIndexOf('/')));
    };

    if (distributionVars) {
        return (
            <PropertyDistributionReceipt
                distributionVars={distributionVars.data}
                transactionHashes={distributionVars.transactionHash}
                contractVars={contractVars!}
            />
        );
    }

    return (
        <>
            <Modal show={!!errorMessage} onClose={handleCloseModal} title="Contract deployment failed">
                <p>{errorMessage}</p>
            </Modal>{' '}
            <div className="font-semibold">Create Property Distribution Scheme</div>
            <PropertyDistributionForm
                values={{
                    projectName: contractVars?.projectName,
                    projectAddress: contractVars?.projectAddress?.split('.')[0],
                }}
                minDistributionDate={contractVars?.saleCloseDate}
                onDistributionRequest={onPropertyDistribution}
            />
        </>
    );
}
