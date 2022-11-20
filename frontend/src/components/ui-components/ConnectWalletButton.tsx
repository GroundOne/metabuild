import { useContext } from 'react';
import { NearContext, WalletState } from '../walletContext';
import Button from './Button';

const ConnectWalletButton: React.FC<{ buttonName?: string | null }> = ({ buttonName }) => {
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

    if (buttonName === null) {
        return null;
    }

    return (
        <Button onClick={handleClick} isLoading={walletState === WalletState.Loading}>
            {buttonName ? buttonName : walletState === WalletState.SignedIn ? 'Wallet Connected' : 'Connect Wallet'}
        </Button>
    );
};

export default ConnectWalletButton;
