import { useContext, useEffect } from 'react';
import { WalletState, NearContextProps, NearContext } from '../walletContext';
import Button from './Button';

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
        <Button onClick={handleClick} isLoading={walletState === WalletState.Loading}>
            {buttonName ? buttonName : walletState === WalletState.SignedIn ? 'Wallet Connected' : 'Connect Wallet'}
        </Button>
    );
};

export default ConnectWalletButton;
