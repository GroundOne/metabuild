import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import constants from '../../constants';
import { convertPropertiesStringToIds } from '../../utils/common';
import { ContractVarsParsed } from '../../utils/near-interface';
import AppCard from '../ui-components/AppCard';
import Button from '../ui-components/Button';
import { NearContext, WalletState } from '../walletContext';
import Modal from '../ui-components/Modal';

export default function BuyPartConfirm(props: { hasBgImage: (hasBgImg: boolean) => void }) {
    const { wallet, walletState, contract, tokenContract } = useContext(NearContext);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [partPurchased, setPartPurchased] = useState<{
        purchased: boolean;
        data: null | ContractVarsParsed;
        transactionHashes: null | string;
    }>({
        purchased: false,
        data: null,
        transactionHashes: null,
    });

    const router = useRouter();
    const urlParams = router.query;
    const [contractVars, setContractVars] = useState<null | ContractVarsParsed>(null);
    const isPurchaseClosed = contractVars?.saleOpeningDate && contractVars?.saleOpeningDate < new Date();

    const userLocale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

    useEffect(() => {
        if (!contractVars) {
            const contractAddress = urlParams.project + constants.CONTRACT_ADDRESS_SUFFIX;
            tokenContract.contract_vars(contractAddress).then((contractInfo) => {
                console.log(contractInfo);
                setContractVars(contractInfo);
                props.hasBgImage(!!(contractInfo.projectBackgroundUrl && contractInfo.projectBackgroundUrl.length));
            });
        }
    }, [urlParams.project, tokenContract, props, contractVars]);

    // Handle redirect after deploying the contract
    useEffect(() => {
        setErrorMessage(null);
        setPartPurchased({ purchased: false, data: null, transactionHashes: null });

        const urlParams = router.query;
        // if (urlParams.transactionHashes) {
        if (urlParams.transactionHashes || urlParams.errorCode) {
            // callback from deploy contract

            if (urlParams.errorCode) {
                // http://localhost:3000/part-holder/buy/confirm?project=demo_project_for_sale&errorCode=Error&errorMessage=Contract%2520method%2520is%2520not%2520found
                const errorMessage = decodeURIComponent(urlParams.errorMessage as string) ?? 'Unknown error';
                setErrorMessage(errorMessage);
            } else {
                // http://localhost:3000/part-holder/buy/confirm?project=demo_project_test15&transactionHashes=BuiugUHJBKpsHFwiHuWg1meEVQWy14zrtRDTLGqfLcNS
                console.log('Purchase urlParams.transactionHashes', urlParams.transactionHashes);
                // getContractIdFromTransactionId(urlParams.transactionHashes as string)
                //     .then((contractId) => {
                //         console.log('projectId', contractId);
                //         if (contractId) {
                //             return tokenContract.contract_vars(contractId);
                //         }
                //         console.log('contractId not found!!');
                //         return null;
                //     })
                //     .then((contractVars) => {
                //         console.log('contractVars', contractVars);
                //         contractVars &&
                //             setPartPurchased({
                //                 purchased: true,
                //                 data: contractVars,
                //                 transactionHashes: urlParams.transactionHashes as string,
                //             });
                //     });
            }
        }
    }, [wallet, router, router.query, tokenContract]);

    const handlePurchase = async () => {
        console.log('handlePurchase for ' + contractVars?.projectAddress);
        if (walletState === WalletState.SignedIn) {
            await tokenContract.participatePresale(contractVars!.projectAddress, contractVars!.priceLabel);
        }
    };

    const handleCloseModal = () => {
        setErrorMessage(null);
        setPartPurchased({ purchased: false, data: null, transactionHashes: null });
        router.replace(router.pathname + `?project=${urlParams.project}`, undefined, { shallow: true });
    };

    return (
        <>
            <Modal show={!!errorMessage} onClose={handleCloseModal} title="PART purchase failed">
                <p>{errorMessage}</p>
            </Modal>
            {contractVars?.projectBackgroundUrl && (
                <Image
                    priority
                    id="project-image"
                    className="fixed top-0 left-0 z-[-100] h-full w-full object-cover"
                    alt=""
                    object-fit="cover"
                    width={1920}
                    height={1080}
                    src={contractVars?.projectBackgroundUrl}
                    // src="https://images.squarespace-cdn.com/content/v1/63283ec16922c81dc0f97e2f/e3150b7f-bfc8-4251-ad50-3344f4b21b3d/image.jpg"
                />
            )}
            <AppCard>
                <div className="font-semibold">Buy a PART</div>
                <div className="mt-4">
                    <div className="flex flex-col">
                        <p className="mt-4">
                            Project name: <b>{contractVars?.projectName}</b>
                        </p>
                        <p className="mt-4">
                            Project address: <b>{contractVars?.projectAddress}</b>
                        </p>
                        <p className="mt-4">
                            There are <b>{contractVars?.totalSupply} PARTs</b> in this scheme. The following PARTs have
                            been excluded from the sale by the issuer: <b>{contractVars?.reservedTokens}</b>
                        </p>
                        <p className="mt-4">
                            All available PARTs are priced at <b>{contractVars?.priceLabel} Ⓝ</b> each.
                        </p>
                        <p className="mt-4">
                            Users can now register for the IRD (Initial Random Distribution) happening on{' '}
                            <b>
                                {contractVars?.saleOpeningDate.toLocaleString(userLocale, {
                                    timeZoneName: 'short',
                                })}
                            </b>
                        </p>
                    </div>
                </div>
                <div className="text-center">
                    <Button
                        isDisabled={isPurchaseClosed}
                        isInvertedColor
                        size="md"
                        className="mt-10"
                        onClick={handlePurchase}
                    >
                        CONFIRM PART PURCHASE FOR {contractVars?.priceLabel} NEAR
                    </Button>
                </div>
                {isPurchaseClosed && (
                    <div className="mt-4 text-center text-yellow-600">
                        <p>PART purchase is closed.</p>
                    </div>
                )}
            </AppCard>
        </>
    );
}
