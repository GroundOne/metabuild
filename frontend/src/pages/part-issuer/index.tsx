import type { NextPage } from 'next';
import AppHeader from '../../components/App/AppHeader';
import PartIssuerHowTo from '../../components/part-issuer/PartIssuerHowTo';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const PartIssuer: NextPage = () => {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-[#5E7C9665] to-[#B2C7D145]">
                <ErrorBoundary scope="part-issuer.tsx">
                    <AppHeader connectButtonName="App for PART Issuers" />
                    <PartIssuerHowTo />
                </ErrorBoundary>
            </div>
        </>
    );
};

export default PartIssuer;
