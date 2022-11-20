import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { convertPropertiesStringToIds } from '../../utils/common';
import { ContractVarsParsed } from '../../utils/near-interface';
import Modal from '../ui-components/Modal';
import { NearContext, WalletState } from '../walletContext';
import PropertySelectionForm, { SelectionFormValue } from './PropertySelectionForm';
import PropertySelectionReceipt from './PropertySelectionReceipt';
import AppCard from '../ui-components/AppCard';
import constants from '../../constants';

export default function PropertySelection(props: { hasBgImage: (hasBgImg: boolean) => void }) {
    const { wallet, walletState, contract, tokenContract } = useContext(NearContext);
    const router = useRouter();
    const urlParams = router.query;
    const [contractVars, setContractVars] = useState<null | ContractVarsParsed>(null);
    const [token, setToken] = useState<null | Awaited<ReturnType<typeof tokenContract.nft_tokens_for_owner>>[0]>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [propertySelection, setPropertySelection] = useState<null | string[]>(null);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const userLocale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

    // Handle redirect after property initialisation
    useEffect(() => {
        setErrorMessage(null);

        const urlParams = router.query;
        // if (urlParams.transactionHashes) {
        if (urlParams.transactionHashes || urlParams.errorCode) {
            // callback from deploy contract

            if (urlParams.errorCode) {
                // error callback
                // http://localhost:3000/part-holder/account/property-selection?project=demo_2022_11_18_21_10&token=3&errorCode=userRejected&errorMessage=User%2520rejected%2520transaction
                const errorMessage = decodeURIComponent(urlParams.errorMessage as string) ?? 'Unknown error';
                setErrorMessage(errorMessage);
            } else {
                // success callback
                // http://localhost:3000/part-holder/account/property-selection?project=demo_2022_11_19_23_52&token=3&transactionHashes=HJMsnxAAkPukcrd2tfLhD9pgvUUMThxRPemwcNU76heH
                // http://localhost:3000/part-holder/account/property-selection?project=demo_2022_11_19_23_09&token=5&transactionHashes=2eWgwzSkLYwMpBgP2H8s7RCWqdz5Jr3AMNPhK1FYy3ux
                setTransactionHash(urlParams.transactionHashes as string);
                tokenContract
                    .property_preferences(`${urlParams.project as string}${constants.CONTRACT_ADDRESS_SUFFIX}`)
                    .then((data) => {
                        const propertyPreference = data.find((item) => Object.keys(item)[0] === urlParams.token);
                        const propertyPreferenceIds = propertyPreference
                            ? Object.values(propertyPreference)[0].propertyPreferenceIds
                            : [];
                        setPropertySelection(propertyPreferenceIds);
                    });
            }
        }
    }, [router.query, token, tokenContract]);

    useEffect(() => {
        if (!contractVars && urlParams.project && urlParams.token) {
            tokenContract
                .contract_vars(`${urlParams.project as string}${constants.CONTRACT_ADDRESS_SUFFIX}`)
                .then((contractInfo) => {
                    setContractVars(contractInfo);
                    props.hasBgImage(!!(contractInfo.projectBackgroundUrl && contractInfo.projectBackgroundUrl.length));
                    return tokenContract.nft_tokens_for_owner(contractInfo.projectAddress);
                })
                .then((tokens) => {
                    const token = tokens.find((token) => token.token_id === urlParams.token);
                    setToken(token!);
                });
        }
    }, [contractVars, props, tokenContract, urlParams.project, urlParams.token]);

    const onPropertySelection = (dist: SelectionFormValue) => {
        const selectedPropertyIds = convertPropertiesStringToIds(dist.selectedProperties);
        if (walletState === WalletState.SignedIn) {
            tokenContract.setPreferencesProperties({
                contractId: contractVars!.projectAddress,
                token_id: token?.token_id!,
                propertyPreferenceIds: selectedPropertyIds,
            });
        }
    };

    const handleCloseModal = () => {
        setErrorMessage(null);
        router.replace(router.pathname.slice(0, router.pathname.lastIndexOf('/')));
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

    if (propertySelection) {
        return (
            <>
                {BackgroundImage}
                <AppCard>
                    <PropertySelectionReceipt
                        contractVars={contractVars!}
                        transactionHashes={transactionHash!}
                        selectedProperties={propertySelection}
                    />
                </AppCard>
            </>
        );
    }

    return (
        <>
            <AppCard>
                <Modal show={!!errorMessage} onClose={handleCloseModal} title="Property selection failed">
                    <p>{errorMessage}</p>
                </Modal>
                {BackgroundImage}
                <div className="mb-4 text-lg font-semibold">Select favourite Properties</div>
                <p className="mt-4">
                    Project Name: <b>{contractVars?.projectName}</b>
                </p>
                <p className="mt-4">
                    Properties will be distributed on{' '}
                    <b>
                        {contractVars?.distributionStartDate?.toLocaleString(userLocale, {
                            timeZoneName: 'short',
                        })}
                    </b>
                    .
                </p>
                <PropertySelectionForm onPropertySelectionRequest={onPropertySelection} />
            </AppCard>
        </>
    );
}
