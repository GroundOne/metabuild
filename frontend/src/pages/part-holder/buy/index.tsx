import type { NextPage } from 'next';
import Head from 'next/head';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import BuyPart from '../../../components/part-holder/BuyPart';
import AppCard from '../../../components/ui-components/AppCard';
import AppHeader from '../../../components/ui-components/AppHeader';

const App: NextPage = () => {
    return (
        <>
            <Head>
                <title>Ground One</title>
                {/* <meta name="Ground One" content="Generated by create next app" /> */}
            </Head>
            <div className="min-h-screen bg-gradient-to-b from-[#5E7C9665] to-[#B2C7D145] pl-[calc(100vw-100%)]">
                <ErrorBoundary scope="buy.tsx">
                    <AppHeader
                        buttons={[
                            { name: 'BUY', url: '/part-holder/buy' },
                            { name: 'ACCOUNT', url: '/part-holder/account' },
                        ]}
                    />
                    <AppCard>
                        <BuyPart />
                    </AppCard>
                </ErrorBoundary>
            </div>
        </>
    );
};

export default App;
