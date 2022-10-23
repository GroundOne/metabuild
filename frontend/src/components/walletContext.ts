import type { Wallet } from '../utils/near-wallet';
import type { contractApi } from '../client_api/contracts';
import { createContext } from 'react';

export enum WalletState {
    SignedIn = 'SignedIn',
    SignedOut = 'SignedOut',
    Loading = 'Loading',
}

export interface NearContextProps {
    wallet: Wallet; walletState: WalletState; contract: ReturnType<typeof contractApi>
}

export const NearContext = createContext<NearContextProps>({} as NearContextProps);
