import { useState, useEffect, useMemo } from 'react';
import { NearWallet } from '../utils/near-wallet';
import { contractApi } from '../client_api/contracts';
import { WalletState, NearContext } from './walletContext';
import { env } from '../constants';
import { PartTokenFactoryInterface } from '../utils/near-interface';

const WalletProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [walletState, setWalletState] = useState(WalletState.Loading);

    // When creating the wallet you can optionally ask to create an access key
    // Having the key enables to call non-payable methods without interrupting the user to sign
    const wallet = useMemo(() => {
        return new NearWallet({ createAccessKeyFor: env.NEXT_PUBLIC_FACTORY_CONTRACT_NAME });
    }, []);

    const contract = useMemo(() => {
        return new PartTokenFactoryInterface(env.NEXT_PUBLIC_FACTORY_CONTRACT_NAME, wallet);
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
