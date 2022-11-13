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

export default function BuyPartConfirm() {
    const { wallet, walletState, contract, tokenContract } = useContext(NearContext);

    const router = useRouter();
    const urlParams = router.query;
    const [contractVars, setContractVars] = useState<null | ContractVarsParsed>(null);

    useEffect(() => {
        const contractAddress = urlParams.project + constants.CONTRACT_ADDRESS_SUFFIX;
        tokenContract.contract_vars(contractAddress).then((contractInfo) => {
            console.log(contractInfo);
            setContractVars(contractInfo);
        });
    }, [urlParams.project, tokenContract]);

    const handlePurchase = async () => {
        console.log('handlePurchase for ' + contractVars?.projectAddress);
    };

    return (
        <>
            <Image
                id="project-image"
                className="fixed top-0 left-0 z-[-100] h-full w-full object-cover"
                alt=""
                object-fit="cover"
                width={1920}
                height={1080}
                src="https://images.squarespace-cdn.com/content/v1/63283ec16922c81dc0f97e2f/e3150b7f-bfc8-4251-ad50-3344f4b21b3d/image.jpg"
            />
            <AppCard>
                <div className="font-semibold">PART Sale Statistics</div>
                <div className="mt-4">
                    <div className="flex flex-col">
                        <div className="flex flex-row">
                            <div className="w-1/3">Project Name</div>
                            <div className="w-2/3 text-black">{contractVars?.projectName}</div>
                        </div>
                        <div className="flex flex-row">
                            <div className="w-1/3">Project Address</div>
                            <div className="w-2/3 text-black">{contractVars?.projectAddress}</div>
                        </div>
                        <div className="flex flex-row">
                            <div className="w-1/3">Total PARTs for sale</div>
                            <div className="w-2/3 text-black">{contractVars?.totalSupply}</div>
                        </div>
                        <div className="flex flex-row">
                            <div className="w-1/3">PARTs Reserved</div>
                            <div className="w-2/3 text-black">
                                {contractVars?.reservedTokenIds?.length
                                    ? contractVars.reservedTokenIds.length + ' (' + contractVars?.reservedTokens + ')'
                                    : 'None'}
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <div className="w-1/3">Sale Opening</div>
                            <div className="w-2/3 text-black">{contractVars?.saleOpeningDate.toLocaleDateString()}</div>
                        </div>
                        <div className="flex flex-row">
                            <div className="w-1/3">Sale Close</div>
                            <div className="w-2/3 text-black">{contractVars?.saleCloseDate.toLocaleDateString()}</div>
                        </div>
                        <div className="flex flex-row">
                            <div className="w-1/3">Parts Sold</div>
                            <div className="w-2/3 text-black">{contractVars?.currentTokenId ?? 1 - 1}</div>
                        </div>
                        <div className="flex flex-row">
                            <div className="w-1/3">Price of PART</div>
                            <div className="w-2/3 text-black">{contractVars?.priceLabel} NEAR</div>
                        </div>
                    </div>
                </div>
                <Button isInvertedColor size="md" className="mt-10" onClick={handlePurchase}>
                    CONFIRM PART PURCHASE FOR {contractVars?.priceLabel} NEAR
                </Button>
            </AppCard>
        </>
    );
}
