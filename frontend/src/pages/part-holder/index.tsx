import type { NextPage } from 'next';
import AppHeader from '../../components/ui-components/AppHeader';
import PartHolderHowTo from '../../components/part-holder/PartHolderHowTo';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const PartHolder: NextPage = () => {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-[#5E7C9665] to-[#B2C7D145] pl-[calc(100vw-100%)]">
                <ErrorBoundary scope="part-holder.tsx">
                    <AppHeader connectButtonName={null} />
                    <PartHolderHowTo />
                </ErrorBoundary>
            </div>
        </>
    );
};

export default PartHolder;
