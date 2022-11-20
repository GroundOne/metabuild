import { useEffect, useMemo, useState } from 'react';
import { env } from '../constants';
import { PartTokenFactoryInterface, PartTokenInterface } from '../utils/near-interface';
import { NearWallet } from '../utils/near-wallet';
import { NearContext, WalletState } from './walletContext';

const WalletProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [walletState, setWalletState] = useState(WalletState.Loading);
    const [contractId, setContractId] = useState(env.NEXT_PUBLIC_TOKEN_CONTRACT_NAME);

    // When creating the wallet you can optionally ask to create an access key
    // Having the key enables to call non-payable methods without interrupting the user to sign
    const wallet = useMemo(() => {
        return new NearWallet({ createAccessKeyFor: env.NEXT_PUBLIC_FACTORY_CONTRACT_NAME });
    }, []);
    const contract = useMemo(() => {
        return new PartTokenFactoryInterface(env.NEXT_PUBLIC_FACTORY_CONTRACT_NAME, wallet);
    }, [wallet]);

    const tokenContract = useMemo(() => {
        return new PartTokenInterface(contractId, wallet);
    }, [wallet, contractId]);

    useEffect(() => {
        const init = async () => {
            const isSignedIn = await wallet.startUp();
            if (isSignedIn) {
                setWalletState(WalletState.SignedIn);
            } else {
                setWalletState(WalletState.SignedOut);
            }
        };
        init();
    }, [wallet]);

    return (
        <NearContext.Provider
            value={{
                wallet,
                walletState,
                contractId,
                setContractId,
                contract,
                tokenContract,
            }}
        >
            {children}
        </NearContext.Provider>
    );
};

export default WalletProvider;
