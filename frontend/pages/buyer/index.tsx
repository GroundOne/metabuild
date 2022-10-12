import type { NextPage } from 'next';
import AppHeader from '../../src/components/App/AppHeader';
import BuyerHowTo from '../../src/components/buyers/BuyerHowTo';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';

const Buyer: NextPage = () => {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-[#5E7C9665] to-[#B2C7D145]">
                <ErrorBoundary scope="buyer.tsx">
                    <AppHeader />
                    <BuyerHowTo />
                </ErrorBoundary>
            </div>
        </>
    );
};

export default Buyer;
