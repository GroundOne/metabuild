import { useContext, useEffect } from 'react';
import { WalletState, NearContextProps, NearContext } from '../walletContext';

const ConnectWalletButton: React.FC<{ buttonName?: string }> = ({ buttonName }) => {
    const { wallet, walletState } = useContext(NearContext);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (walletState === WalletState.SignedOut) {
            await wallet.signIn();
        }
        if (walletState === WalletState.SignedIn) {
            wallet.signOut();
        }
    };

    return (
        <button type="button" className="ff-btn-primary" onClick={handleClick}>
            {buttonName || walletState === WalletState.SignedIn ? 'Wallet Connected' : 'Connect Wallet'}
        </button>
    );
};

export default ConnectWalletButton;
