import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import AppHeader from '../../components/ui-components/AppHeader';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import CreatePVT from '../../components/part-issuer/CreatePVT';

const App: NextPage = () => {
    return (
        <>
            <Head>
                <title>Ground One</title>
                {/* <meta name="Ground One" content="Generated by create next app" /> */}
            </Head>
            <div className="min-h-screen bg-gradient-to-b from-[#5E7C9665] to-[#B2C7D145] pl-[calc(100vw-100%)]">
                <ErrorBoundary scope="create-pvt.tsx">
                    <AppHeader
                        buttons={[
                            { name: 'CREATE', url: '/part-issuer/create-part' },
                            { name: 'MANAGE', url: '/part-issuer/manage-part' },
                            // { name: 'TEST', url: '/part-issuer/create-pvt' },
                        ]}
                    />
                    <CreatePVT />
                </ErrorBoundary>
                <Image
                    className="fixed top-0 left-0 z-[-100] h-full w-full object-cover"
                    alt=""
                    object-fit="cover"
                    width={1920}
                    height={1080}
                    src="https://images.squarespace-cdn.com/content/v1/63283ec16922c81dc0f97e2f/e3150b7f-bfc8-4251-ad50-3344f4b21b3d/image.jpg"
                />
            </div>
        </>
    );
};

export default App;
