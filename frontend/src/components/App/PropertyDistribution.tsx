import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { convertPropertiesStringToIds } from '../../utils/common';
import { ContractVarsParsed } from '../../utils/near-interface';
import { NearContext, WalletState } from '../walletContext';
import PropertyDistributionForm, { DistributionFormValue } from './PropertyDistributionForm';

export default function PropertyDistribution() {
    const { wallet, walletState, contract, tokenContract } = useContext(NearContext);

    const router = useRouter();
    const urlParams = router.query;
    const [contractVars, setContractVars] = useState<null | ContractVarsParsed>(null);

    useEffect(() => {
        tokenContract.contract_vars(urlParams.project as string).then((contractInfo) => setContractVars(contractInfo));
    }, [urlParams.project, tokenContract]);

    const onPropertyDistribution = (dist: DistributionFormValue) => {
        const reservedPropertyIds = convertPropertiesStringToIds(dist.reservedProperties);
        if (walletState === WalletState.SignedIn) {
            tokenContract.initProperty(dist.projectAddress, {
                totalSupply: dist.totalProperties,
                distributionStart: (dist.distributionDate.getTime() * 1e6).toString(),
                reservedTokenIds: reservedPropertyIds,
            });
        }
    };

    return (
        <>
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
