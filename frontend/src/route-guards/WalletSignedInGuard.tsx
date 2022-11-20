const redirects = {
    [WalletState.SignedIn]: {
        ['/part-issuer']: '/part-issuer/create-part',
        ['/part-holder']: '/part-holder/buy',
    },
    [WalletState.SignedOut]: {
        ['/part-issuer/create-part']: '/part-issuer',
        ['/part-issuer/manage-part']: '/part-issuer',
        ['/part-issuer/manage-part/distribution']: '/part-issuer',
        ['/part-issuer/manage-part/initialisation']: '/part-issuer',
        ['/part-issuer/manage-part/part-sale-statistics']: '/part-issuer',
        ['/part-issuer/create-pvt']: '/part-issuer',
        ['/part-holder/buy']: '/part-holder',
        ['/part-holder/buy/confirm']: '/part-holder',
        ['/part-holder/account']: '/part-holder',
        ['/part-holder/account/property-selection']: '/part-holder',
    },
    [WalletState.Loading]: {},
};

import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { NearContext, WalletState } from '../components/walletContext';

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

    if (walletState === WalletState.Loading) {
        return <>Loading...</>;
    }

    return <>{children}</>;
};
