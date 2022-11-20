import type { AppProps } from 'next/app';
import WalletProvider from '../components/WalletProvider';
import { WalletSignedInGuard } from '../route-guards/WalletSignedInGuard';
import '../styles/globals.css';

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
