import { Wallet } from '../utils/near-wallet';

export const contractApi = ({ contractId, walletToUse }: { contractId: string, walletToUse: Wallet }) => { 
    const api = {
        getNftTokens: async () => {
            await new Promise (resolve => setTimeout(resolve, 1000));
            return walletToUse.viewMethod({ contractId, method: 'nft_tokens' });
        }
    }
    return api;
}

// export class ContractApi {
//     private contractId: string;
//     private wallet: Wallet;

//     constructor({ contractId, walletToUse }: { contractId: string, walletToUse: Wallet }) {
//         this.contractId = contractId;
//         this.wallet = walletToUse;
//     }

//     async getNftTokens(): Promise<string[]> {
//         await new Promise (resolve => setTimeout(resolve, 1000));
//         return await this.wallet.viewMethod({ contractId: this.contractId, method: 'nft_tokens' });
//     }
// }
