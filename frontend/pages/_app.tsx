import '../styles/globals.css';
import type { AppProps } from 'next/app';
import WalletProvider from '../src/components/WalletProvider';
import { WalletSignedInGuard } from '../src/route-guards/WalletSignedInGuard';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WalletProvider>
            <WalletSignedInGuard>
                <Component {...pageProps} />
            </WalletSignedInGuard>
        </WalletProvider>
    );
}

export default MyApp;
