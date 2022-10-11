import type { NextPage } from 'next';
import AppHeader from '../../src/components/App/AppHeader';
import CreatorHowTo from '../../src/components/creators/CreatorHowTo';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';

const Creator: NextPage = () => {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-[#5E7C9665] to-[#B2C7D145]">
                <ErrorBoundary scope="architect.tsx">
                    <AppHeader connectButtonName="App for PART Creators" redirect="/App" />
                    <CreatorHowTo />
                </ErrorBoundary>
            </div>
        </>
    );
};

export default Creator;
