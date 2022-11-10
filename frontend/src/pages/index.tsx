import type { NextPage } from 'next';
import Head from 'next/head';
import HomepageHeader from '../components/Homepage/HomepageHeader';
import Hero from '../components/Homepage/Hero';
import StepOne from '../components/Homepage/StepOne';
import StepTwo from '../components/Homepage/StepTwo';
import { ErrorBoundary } from '../components/ErrorBoundary';
import SendMail from '../components/samples/SendMail';

const Home: NextPage = (props: any) => {
    return (
        <>
            <Head>
                <title>Ground One</title>
                {/* <meta name="Ground One" content="Generated by create next app" /> */}
            </Head>
            <div>
                <ErrorBoundary scope="index.tsx">
                    {/* <SendMail /> */}
                    <HomepageHeader />
                    <Hero />
                    <StepOne />
                    <StepTwo />
                </ErrorBoundary>
            </div>
        </>
    );
};

export default Home;
