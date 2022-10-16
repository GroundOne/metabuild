import { Wallet } from '../utils/near-wallet';


interface TokenMetadata {
    title?: string
    description?: string
    media?: string
    media_hash?: string
    copies?: number
    issued_at?: string
    expires_at?: string
    starts_at?: string
    updated_at?: string
    extra?: string
    reference?: string
    reference_hash?: string
}

export const contractApi = ({ contractId, walletToUse }: { contractId: string, walletToUse: Wallet }) => {
    const api = {
        call: {
            internalMintForPresaleParticipants: async (data: TokenMetadata) => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return walletToUse.callMethod({
                    contractId, method: 'nft_mint_for_presale_participants', args: data
                });
            }

        }, get: {
            nftTokens: async () => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return walletToUse.viewMethod({ contractId, method: 'nft_tokens' });
            }
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
