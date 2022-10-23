import { useState, useEffect, useMemo } from 'react';
import { Wallet } from '../utils/near-wallet';
import { contractApi } from '../client_api/contracts';
import { WalletState, NearContext } from './walletContext';
import { env } from '../constants';

const WalletProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [walletState, setWalletState] = useState(WalletState.Loading);

    // When creating the wallet you can optionally ask to create an access key
    // Having the key enables to call non-payable methods without interrupting the user to sign
    const wallet = useMemo(() => {
        return new Wallet({ createAccessKeyFor: env.NEXT_PUBLIC_CONTRACT_NAME });
    }, []);

    const contract = useMemo(() => {
        return contractApi({
            walletToUse: wallet,
            contractId: env.NEXT_PUBLIC_CONTRACT_NAME,
        });
    }, [wallet]);

    useEffect(() => {
        const init = async () => {
            let isSignedIn = await wallet.startUp();
            if (isSignedIn) {
                setWalletState(WalletState.SignedIn);
            } else {
                setWalletState(WalletState.SignedOut);
            }
        };
        init();
    }, [wallet]);

    return <NearContext.Provider value={{ wallet, walletState, contract }}>{children}</NearContext.Provider>;
};

export default WalletProvider;
