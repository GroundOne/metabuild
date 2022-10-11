import { useContext } from 'react';
import { useRouter } from 'next/router';
import { WalletState, NearContextProps, NearContext } from '../walletContext';

const ConnectWalletButton: React.FC<{
    connectButtonName: string;
    onSignInRedirect?: string;
    onSignOutRedirect?: string;
}> = ({ connectButtonName, onSignInRedirect, onSignOutRedirect }) => {
    const router = useRouter();
    const { wallet, walletState } = useContext(NearContext);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (onSignInRedirect) {
            if (walletState !== WalletState.SignedIn) {
                await wallet.signIn();
            }
            if (walletState === WalletState.SignedIn) {
                router.push(onSignInRedirect);
            }
        }
        if (onSignOutRedirect) {
            if (walletState !== WalletState.SignedOut) {
                wallet.signOut();
            }
            if (walletState === WalletState.SignedOut) {
                router.push(onSignOutRedirect);
            }
        }
    };

    return (
        // <Link href={redirect}>
        <button className="ff-btn-primary" onClick={handleClick}>
            {walletState === WalletState.SignedIn ? 'Wallet Connected' : connectButtonName}
        </button>
        // </Link>
    );
};

export default ConnectWalletButton;
