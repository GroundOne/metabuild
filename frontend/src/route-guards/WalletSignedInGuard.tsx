const redirects = {
    [WalletState.SignedIn]: {
        ['/creator']: '/creator/create-part',
        ['/buyer']: '/buyer/buy',
    },
    [WalletState.SignedOut]: {
        ['/creator/create-part']: '/creator',
        ['/creator/create-pvt']: '/creator',
        ['/buyer/buy']: '/buyer',
        ['/buyer/account']: '/buyer',
    },
    [WalletState.Loading]: {},
};

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { WalletState, NearContext } from '../components/walletContext';

export const WalletSignedInGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const { walletState } = useContext(NearContext);

    useEffect(() => {
        // @ts-ignore-next-line
        if (redirects[walletState][router.pathname]) {
            // @ts-ignore-next-line
            router.push(redirects[walletState][router.pathname]);
        }
    }, [walletState, router]);

    return <>{children}</>;
};
