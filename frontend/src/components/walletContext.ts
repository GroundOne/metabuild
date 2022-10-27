import { NearWallet } from '../utils/near-wallet';
import { PartTokenFactoryInterface, PartTokenInterface } from './../utils/near-interface';
// import type { contractApi } from "../client_api/contracts"
import { createContext } from 'react';

export enum WalletState {
    SignedIn = 'SignedIn',
    SignedOut = 'SignedOut',
    Loading = 'Loading',
}

export interface NearContextProps {
    wallet: NearWallet;
    walletState: WalletState;
    contract: PartTokenFactoryInterface;
    getPartTokenWalletAndContract: (createAccessKeyFor: string) => {
        partTokenWallet: NearWallet;
        partTokenContract: PartTokenInterface;
    };
    // wallet: Wallet; walletState: WalletState; contract: ReturnType<typeof contractApi>
}

export const NearContext = createContext<NearContextProps>({} as NearContextProps);
