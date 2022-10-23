import type { NextPage } from 'next';
import AppHeader from '../../components/App/AppHeader';
import CreatorHowTo from '../../components/creators/CreatorHowTo';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const Creator: NextPage = () => {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-[#5E7C9665] to-[#B2C7D145]">
                <ErrorBoundary scope="creator.tsx">
                    <AppHeader connectButtonName="App for PART Creators" />
                    <CreatorHowTo />
                </ErrorBoundary>
            </div>
        </>
    );
};

export default Creator;
