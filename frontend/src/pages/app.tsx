import type { NextPage } from 'next';
import Head from 'next/head';
import AppHeader from '../components/App/AppHeader';
import BuyerHowTo from '../components/buyers/BuyerHowTo';
import CreatePart from '../components/App/CreatePart';
import WalletSample from '../components/App/WalletSample';
import { ErrorBoundary } from '../components/ErrorBoundary';

const App: NextPage = (props: any) => {
    return (
        <>
            <Head>
                <title>Ground One</title>
                {/* <meta name="Ground One" content="Generated by create next app" /> */}
            </Head>
            <div className="min-h-screen bg-gradient-to-b from-[#5E7C9665] to-[#B2C7D145]">
                <ErrorBoundary scope="app.tsx">
                    {/* <AppHeader  /> */}
                    {/* <WalletSample /> */}
                    <CreatePart />
                    {/* <BuyerHowTo /> */}
                </ErrorBoundary>
            </div>
        </>
    );
};

export default App;