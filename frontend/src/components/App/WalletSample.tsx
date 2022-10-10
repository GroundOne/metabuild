import { useState, useEffect, useMemo, useRef } from 'react';

import { Wallet } from '../../utils/near-wallet';

import AppCard from '../UI/AppCard';
import clsx from 'clsx';
import { contractApi as ca } from '../../api/contracts';
import { useAsync } from '../../utils/useAsync';

enum WalletState {
    SignedIn= 'SignedIn',
    SignedOut= 'SignedOut',
    Loading= 'Loading',
}
export default function WalletSample() {
    // When creating the wallet you can optionally ask to create an access key
    // Having the key enables to call non-payable methods without interrupting the user to sign
    const wallet = useMemo(() => {
        return new Wallet({ createAccessKeyFor: process.env.CONTRACT_NAME || 'part.groundone.testnet' });
    }, []);

    const contractApi = useMemo(() => {
        return ca({
            walletToUse: wallet,
            contractId: process.env.CONTRACT_NAME || 'part.groundone.testnet',
        });
    }, [wallet]);


    const [walletState, setWalletState] = useState(WalletState.Loading);

    useEffect(() => {
        async function init() {
            let isSignedIn = await wallet.startUp();

            if (isSignedIn) {
                setWalletState(WalletState.SignedIn);
            } else {
                setWalletState(WalletState.SignedOut);
            }
        }
        init();
    }, [wallet]);

    const nftTokensCall = useAsync(contractApi.getNftTokens);

    const runViewMethod = async () => {
        console.log(walletState);
        if (walletState === WalletState.SignedIn) {
            nftTokensCall.execute();
        }

        // const retVal = await wallet.viewMethod({ contractId: 'part.groundone.testnet', method: 'nft_tokens' });
        // // const retVal= await wallet.viewMethod({ contractId: 'part.groundone.testnet', method: 'nft_total_supply' });
        // console.log(retVal);
    };

    return (
        <AppCard>
            <div className="font-semibold">Wallet functions</div>
            <div>Status: {walletState}</div>
            <button
                type="button"
                onClick={walletState === WalletState.SignedIn ? wallet.signOut : wallet.signIn}
                className="ff-btn-primary mt-10 w-1/2 bg-[#C3CED8] text-white hover:bg-opacity-90 hover:text-white"
            >
                {walletState === WalletState.SignedOut ? 'Sign In' : 'Sign Out'}
            </button>

            <div className="container grid grid-cols-2 gap-x-10">
                <button
                    type="button"
                    className={clsx(
                   walletState=== WalletState.SignedIn && 'disabled',
                        'ff-btn-primary mt-10 bg-[#C3CED8] text-white hover:bg-opacity-90 hover:text-white'
                    )}
                    disabled={walletState !== WalletState.SignedIn}
                    onClick={runViewMethod}
                >
                    {`Run View Method ${nftTokensCall.status}` } 
                </button>
                <button
                    type="button"
                    className={clsx(
                        walletState=== WalletState.SignedIn && 'disabled',
                        'ff-btn-primary mt-10 bg-[#C3CED8] text-white hover:bg-opacity-90 hover:text-white'
                    )}
                    disabled={walletState !== WalletState.SignedIn}
                >
                    Run Call Method
                </button>

                data: {JSON.stringify(nftTokensCall.value)}
            </div>
        </AppCard>
    );
}
