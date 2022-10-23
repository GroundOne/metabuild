import { useState, useEffect, useMemo } from 'react';

import { Wallet } from '../../utils/near-wallet';

import AppCard from '../ui-components/AppCard';
import clsx from 'clsx';
import { contractApi } from '../../client_api/contracts';
import { useAsync } from '../../utils/useAsync';
import { env } from '../../constants';

enum WalletState {
    SignedIn = 'SignedIn',
    SignedOut = 'SignedOut',
    Loading = 'Loading',
}
export default function WalletSample() {
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

    const nftTokensCall = useAsync(contract.get.nftTokens);

    const runViewMethod = async () => {
        console.log(walletState);
        if (walletState === WalletState.SignedIn) {
            nftTokensCall.execute();
        }
    };

    return (
        <AppCard>
            <div className="font-semibold">Wallet functions</div>
            <div>Status: {walletState}</div>
            <button
                type="button"
                onClick={walletState === WalletState.SignedIn ? wallet.signOut : wallet.signIn}
                className="mt-10 w-1/2 bg-[#C3CED8] text-white hover:bg-opacity-90 hover:text-white"
            >
                {walletState === WalletState.SignedOut ? 'Sign In' : 'Sign Out'}
            </button>

            <div className="container grid grid-cols-2 gap-x-10">
                <button
                    type="button"
                    className={clsx(
                        walletState === WalletState.SignedIn && 'disabled',
                        'mt-10 bg-[#C3CED8] text-white hover:bg-opacity-90 hover:text-white'
                    )}
                    disabled={walletState !== WalletState.SignedIn}
                    onClick={runViewMethod}
                >
                    {`Run View Method ${nftTokensCall.status}`}
                </button>
                <button
                    type="button"
                    className={clsx(
                        walletState === WalletState.SignedIn && 'disabled',
                        'mt-10 bg-[#C3CED8] text-white hover:bg-opacity-90 hover:text-white'
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
