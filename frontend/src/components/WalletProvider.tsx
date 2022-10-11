import { useState, useEffect, useMemo } from 'react';
import { Wallet } from '../utils/near-wallet';
import { contractApi } from '../api/contracts';
import {WalletState, NearContext } from './walletContext';

const WalletProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [walletState, setWalletState] = useState(WalletState.Loading);
    
    // When creating the wallet you can optionally ask to create an access key
    // Having the key enables to call non-payable methods without interrupting the user to sign
    const wallet = useMemo(() => {
        return new Wallet({ createAccessKeyFor: process.env.CONTRACT_NAME || 'part.groundone.testnet' });
    }, []);

    const contract = useMemo(() => {
        return contractApi({
            walletToUse: wallet,
            contractId: process.env.CONTRACT_NAME || 'part.groundone.testnet',
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

    return (
        <NearContext.Provider value={{ wallet, walletState, contract }}>
            {children}
        </NearContext.Provider>
    );
};

export default WalletProvider;
