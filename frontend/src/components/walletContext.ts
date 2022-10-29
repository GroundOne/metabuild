import { NearWallet } from '../utils/near-wallet';
import { PartTokenFactoryInterface, PartTokenInterface } from './../utils/near-interface';
import { createContext, Dispatch, SetStateAction } from 'react';

export enum WalletState {
    SignedIn = 'SignedIn',
    SignedOut = 'SignedOut',
    Loading = 'Loading',
}

export interface NearContextProps {
    wallet: NearWallet;
    walletState: WalletState;
    contractId: string;
    setContractId: Dispatch<SetStateAction<string>>;
    contract: PartTokenFactoryInterface;
    tokenContract: PartTokenInterface;
}

export const NearContext = createContext<NearContextProps>({} as NearContextProps);
