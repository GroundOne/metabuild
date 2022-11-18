import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import constants from '../../constants';
import { ContractVarsParsed } from '../../utils/near-interface';
import AppCard from '../ui-components/AppCard';
import Button from '../ui-components/Button';
import { NearContext, WalletState } from '../walletContext';
import Modal from '../ui-components/Modal';
import BuyPartReceipt from './BuyPartReceipt';

type PurchaseOptions = 'closed' | 'participateIRD' | 'pendingSaleOpening' | 'buyPart' | null;

export default function BuyPartConfirm(props: { hasBgImage: (hasBgImg: boolean) => void }) {
    const { wallet, walletState, contract, tokenContract } = useContext(NearContext);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [partPurchased, setPartPurchased] = useState<{
        purchased: boolean;
        purchaseOptions: PurchaseOptions;
        transactionHashes: null | string;
    }>({
        purchased: false,
        purchaseOptions: null,
        transactionHashes: null,
    });

    const router = useRouter();
    const urlParams = router.query;
    const [contractVars, setContractVars] = useState<null | ContractVarsParsed>(null);
    let purchaseOptions: PurchaseOptions = null;
    if (contractVars && contractVars.saleOpeningDate > new Date() && contractVars.contractStatus === 'presale') {
        purchaseOptions = 'participateIRD';
    } else if (contractVars && contractVars.saleOpeningDate < new Date() && contractVars.contractStatus === 'presale') {
        purchaseOptions = 'pendingSaleOpening';
    } else if (contractVars && contractVars.saleCloseDate > new Date() && contractVars.contractStatus === 'sale') {
        purchaseOptions = 'buyPart';
    } else {
        purchaseOptions = 'closed';
    }

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
        setPartPurchased({ purchased: false, purchaseOptions: null, transactionHashes: null });

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
                setPartPurchased({
                    purchased: true,
                    purchaseOptions: purchaseOptions,
                    transactionHashes: urlParams.transactionHashes as string,
                });
            }
        }
    }, [router.query, purchaseOptions]);

    const handlePurchase = async () => {
        console.log('handlePurchase for ' + contractVars?.projectAddress);
        if (purchaseOptions === 'buyPart') {
            await tokenContract.nftMint(
                contractVars!.projectAddress,
                contractVars!.projectName,
                contractVars!.priceLabel
            );
        } else if (purchaseOptions === 'participateIRD') {
            await tokenContract.participatePresale(contractVars!.projectAddress, contractVars!.priceLabel);
        }
    };

    const handleCloseModal = () => {
        setErrorMessage(null);
        setPartPurchased({ purchased: false, purchaseOptions: null, transactionHashes: null });
        router.replace(router.pathname + `?project=${urlParams.project}`, undefined, { shallow: true });
    };

    const BackgroundImage: JSX.Element | null = contractVars?.projectBackgroundUrl ? (
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
    ) : null;

    if (partPurchased.purchased) {
        return (
            <>
                {BackgroundImage}
                <AppCard>
                    <BuyPartReceipt
                        contractVars={contractVars!}
                        purchaseOptions={partPurchased.purchaseOptions as 'participateIRD' | 'buyPart'}
                        transactionHashes={partPurchased.transactionHashes!}
                    />
                </AppCard>
            </>
        );
    }

    return (
        <>
            <Modal show={!!errorMessage} onClose={handleCloseModal} title="PART purchase failed">
                <p>{errorMessage}</p>
            </Modal>
            {BackgroundImage}
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
                        {purchaseOptions === 'buyPart' && (
                            <>
                                <p className="mt-4">
                                    Sale available until{' '}
                                    <b>
                                        {contractVars?.saleCloseDate.toLocaleString(userLocale, {
                                            timeZoneName: 'short',
                                        })}
                                    </b>
                                </p>
                                <p className="mt-4">
                                    Current highest ranking available:{' '}
                                    <b>{contractVars?.soldTokens ? contractVars.soldTokens + 1 : 1}</b>
                                </p>
                                <p className="mt-4">
                                    You will be assigned the highest ranking available at the moment of the transaction.
                                    Please note that your final ranking may differ from the ranking mentioned above in
                                    case sales have happened in the meantime. Refresh your browser to get the latest
                                    available ranking.
                                </p>
                            </>
                        )}
                        {purchaseOptions === 'participateIRD' && (
                            <p className="mt-4">
                                Users can now register for the IRD (Initial Random Distribution) happening on{' '}
                                <b>
                                    {contractVars?.saleOpeningDate.toLocaleString(userLocale, {
                                        timeZoneName: 'short',
                                    })}
                                </b>
                            </p>
                        )}
                    </div>
                </div>
                <div className="text-center">
                    <Button
                        isDisabled={purchaseOptions === 'closed' || purchaseOptions === 'pendingSaleOpening'}
                        isInvertedColor
                        size="md"
                        className="mt-10"
                        onClick={handlePurchase}
                    >
                        CONFIRM PART PURCHASE FOR {contractVars?.priceLabel} NEAR
                    </Button>
                </div>
                {purchaseOptions === 'closed' && (
                    <div className="mt-4 text-center text-yellow-600">
                        <p>PART purchase is closed.</p>
                    </div>
                )}
                {purchaseOptions === 'pendingSaleOpening' && (
                    <div className="mt-4 text-center text-yellow-600">
                        <p>Waiting for the PART Issuer to initiate the sale.</p>
                    </div>
                )}
            </AppCard>
        </>
    );
}
