import type { NextPage } from 'next';
import Head from 'next/head';
import AppHeader from '../../../components/ui-components/AppHeader';
import PartSaleStatistics from '../../../components/part-issuer/PartSaleStatistics';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import AppCard from '../../../components/ui-components/AppCard';

const App: NextPage = (props: any) => {
    return (
        <>
            <Head>
                <title>Ground One</title>
                {/* <meta name="Ground One" content="Generated by create next app" /> */}
            </Head>
            <div className="min-h-screen bg-gradient-to-b from-[#5E7C9665] to-[#B2C7D145] pl-[calc(100vw-100%)]">
                <ErrorBoundary scope="distribution.tsx">
                    <AppHeader
                        buttons={[
                            { name: 'CREATE', url: '/part-issuer/create-part' },
                            { name: 'MANAGE', url: '/part-issuer/manage-part' },
                            // { name: 'TEST', url: '/part-issuer/create-pvt' },
                        ]}
                    />
                    <AppCard>
                        <PartSaleStatistics />
                    </AppCard>
                </ErrorBoundary>
            </div>
        </>
    );
};

export default App;
