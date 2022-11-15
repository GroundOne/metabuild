import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import constants from '../../constants';
import { DeployArgs, NFTContractMetadata } from '../../utils/partToken';
import { NearContext, WalletState } from '../walletContext';
import CreatePartForm, { PartFormValue } from './CreatePartForm';
import Modal from '../ui-components/Modal';
import { convertPropertiesStringToIds, getContractIdFromTransactionId } from '../../utils/common';
import { ContractVarsParsed } from '../../utils/near-interface';
import CreatePartReceipt from './CreatePartReceipt';

export default function CreatePart() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [contractDeployed, setContractDeployed] = useState<{
        deployed: boolean;
        data: null | ContractVarsParsed;
        transactionHashes: null | string;
    }>({
        deployed: false,
        data: null,
        transactionHashes: null,
    });

    const { wallet, walletState, contract, tokenContract } = useContext(NearContext);
    const router = useRouter();

    // Handle redirect after deploying the contract
    useEffect(() => {
        setErrorMessage(null);
        setContractDeployed({ deployed: false, data: null, transactionHashes: null });

        const urlParams = router.query;
        // if (urlParams.transactionHashes) {
        if (urlParams.transactionHashes || urlParams.errorCode) {
            // callback from deploy contract

            if (urlParams.errorCode) {
                // errorCode: "Error" | "userRejected"
                // errorMessage: "Can't%20create%20a%20new%20account%20ff_demo_project.part_factory.groundone.testnet%2C%20because%20it%20already%20exists" | User%2520rejected%2520transaction
                // transactionHashes: "6G7tBRaHDL63SztJVVEyeNV9q5jk69hat5SZzFcTfYWy"
                const errorMessage = decodeURIComponent(urlParams.errorMessage as string) ?? 'Unknown error';
                setErrorMessage(errorMessage);
            } else {
                getContractIdFromTransactionId(urlParams.transactionHashes as string)
                    .then((contractId) => {
                        console.log('projectId', contractId);
                        if (contractId) {
                            return tokenContract.contract_vars(contractId);
                        }
                        console.log('contractId not found!!');
                        return null;
                    })
                    .then((contractVars) => {
                        console.log('contractVars', contractVars);
                        contractVars &&
                            setContractDeployed({
                                deployed: true,
                                data: contractVars,
                                transactionHashes: urlParams.transactionHashes as string,
                            });
                    });
                //http://localhost:3000/part-issuer/create-part?transactionHashes=48iBkvpn3TMGdYVZmFdPvZAsg864S1svdXznY5uhdPBP
            }
        }
    }, [wallet, router, router.query, tokenContract]);

    const deployAndInitTokenContract = async (args: DeployArgs) => {
        console.log('deployAndInitTokenContract', walletState);
        if (walletState === WalletState.SignedIn) {
            console.log('signed in', walletState);
            await contract.createToken(args);
        }
    };

    const handleCloseModal = () => {
        setErrorMessage(null);
        setContractDeployed({ deployed: false, data: null, transactionHashes: null });
        router.replace(router.pathname);
    };

    const onCreatePart = (part: PartFormValue) => {
        const reservedTokenIds = convertPropertiesStringToIds(part.reserveParts);

        const projectAddress = part.projectAddress.toLowerCase();

        const args: DeployArgs = {
            projectAddress,
            projectName: part.projectName,
            ownerId: wallet.accountId!,
            totalSupply: part.partAmount,
            price: parseNearAmount(part.partPrice.toString())!,
            reservedTokenIds,
            saleOpening: (part.saleOpeningDate.getTime() * 1e6).toString(),
            saleClose: (part.saleCloseDate.getTime() * 1e6).toString(),
            projectBackgroundUrl: part.backgroundImageLink,
            metadata: new NFTContractMetadata({
                spec: constants.NFT_METADATA_SPEC,
                name: part.projectName,
                symbol: projectAddress,
            }),
        };

        deployAndInitTokenContract(args);
    };

    return (
        <>
            {contractDeployed.data && (
                <CreatePartReceipt
                    contractVars={contractDeployed.data}
                    transactionHashes={contractDeployed.transactionHashes!}
                />
            )}
            {/* <Modal
                show={contractDeployed.deployed}
                onClose={handleCloseModal}
                title="Your contract has been deployed successfully"
            >
                <div className="flex flex-col items-center">
                    <div className="text-center text-2xl font-bold">Your contract has been deployed successfully</div>
                    <div className="text-center text-lg">You can now mint your parts and start selling them</div>
                </div>
            </Modal> */}
            <Modal show={!!errorMessage} onClose={handleCloseModal} title="Contract deployment failed">
                <p>{errorMessage}</p>
            </Modal>
            {!contractDeployed.deployed && (
                <>
                    <div className="font-semibold">Create PART Scheme</div>
                    <CreatePartForm onCreatePartRequest={onCreatePart} />
                </>
            )}
        </>
    );
}
