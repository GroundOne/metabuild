/**
 * Based on the following sample:
 * https://github.com/near/wallet-selector
 */
import type { NextPage } from 'next';
import { WalletSelectorContextProvider } from '../src/common/WalletSelectorContext';
import Content from '../src/components/App/Wallet/Content';

const Wallet: NextPage = () => {
    return (
        <>
            <h1>NEAR Guest Book</h1>
            <WalletSelectorContextProvider>
                <Content />
            </WalletSelectorContextProvider>
        </>
    );
};

export default Wallet;
