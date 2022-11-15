import type { NextPage } from 'next';
import Head from 'next/head';
import AppHeader from '../../components/ui-components/AppHeader';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import AppCard from '../../components/ui-components/AppCard';
import Account from '../../components/part-holder/Account';

const App: NextPage = () => {
    return (
        <>
            <Head>
                <title>Ground One</title>
                {/* <meta name="Ground One" content="Generated by create next app" /> */}
            </Head>
            <div className="min-h-screen bg-gradient-to-b from-[#5E7C9665] to-[#B2C7D145] pl-[calc(100vw-100%)]">
                <ErrorBoundary scope="account.tsx">
                    <AppHeader
                        buttons={[
                            { name: 'BUY', url: '/part-holder/buy' },
                            { name: 'ACCOUNT', url: '/part-holder/account' },
                        ]}
                    />
                    <AppCard>
                        <Account />
                    </AppCard>
                </ErrorBoundary>
            </div>
        </>
    );
};

export default App;
