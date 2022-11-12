import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import constants from '../../constants';
import { convertPropertiesStringToIds } from '../../utils/common';
import { ContractVarsParsed } from '../../utils/near-interface';
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
        </>
    );
}
