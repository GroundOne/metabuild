import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { NearContext, WalletState } from '../walletContext';

export default function PartDistribution() {
    const { wallet, walletState, contract, tokenContract } = useContext(NearContext);

    const router = useRouter();
    const urlParams = router.query;
    const [contractInfo, setContractInfo] = useState<any>(null);

    useEffect(() => {
        tokenContract.contract_vars(urlParams.project as string).then((contractInfo) => setContractInfo(contractInfo));
    }, [urlParams.project, tokenContract]);

    return (
        <div>
            <h1>Part Distribution</h1>
            <p>Part Distribution for {urlParams.project}</p>
            <p>Contract Info: {JSON.stringify(contractInfo)}</p>
        </div>
    );
}
