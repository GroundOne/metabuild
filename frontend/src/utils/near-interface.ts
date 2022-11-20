import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { convertPropertyIdsToIdString } from './common';

/**
 * If we import anything from /contracts folder the `npm run build` fails
 */
// import { TokenMetadata } from './../../../contracts/part-token/src/metadata';
// import type { InitializeArgs, InitializePropertiesArgs } from './../../../contracts/part-token/src/types';

/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

import { NearWallet } from './near-wallet';
import { DeployArgs } from './partToken';

type TokenMetadata = {
    title?: string;
    description?: string;
    media?: string;
    mediaHash?: string;
    copies?: number;
    issuedAt?: string;
    expiresAt?: string;
    startsAt?: string;
    updatedAt?: string;
    extra?: string;
    reference?: string;
    referenceHash?: string;
};

type InitializePropertiesArgs = {
    distributionStart: string;
    reservedTokenIds?: string[];
    totalSupply: number;
};

type ContractVars = {
    ownerId: string;
    soldTokens: number;
    currentTokenId: number;
    projectName: string;
    projectAddress: string;
    projectBackgroundUrl?: string;
    totalSupply: number;
    price: string;
    isArchived?: boolean;
    reservedTokenIds: string[];
    saleOpening: string;
    saleClose: string;
    distributionStart: string;
    contractStatus: /** Buyer & Architect: show Project Info */
    | 'presale'
        /** (After Opening, Before Sale Close time) Architect: Show Proceed to sale */
        | 'sale'
        | 'property_selection'
        | 'ended';
};

export type Property = {
    id: string;
    link: string;
};

export type ContractVarsParsed = ContractVars & {
    reservedTokens: string;
    frontEndStatus: 'Presale' | 'PostPresale_Distribution' | 'PostPresale_ProceedToSale';
    saleOpeningDate: Date;
    saleCloseDate: Date;
    distributionStartDate?: Date;
    priceLabel: string;
    properties?: Property[];
    reservedProperties?: string[];
    highestAvailableRanking: number;
};
export class InterfaceFields {
    constructor(public readonly contractId: string, public readonly wallet: NearWallet) {}
}

export class PartTokenFactoryInterface extends InterfaceFields {
    constructor(contractId: string, wallet: NearWallet) {
        super(contractId, wallet);
    }

    /* 
    VIEW METHODS
  */
    async getNumberOfTokens() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'get_number_of_tokens',
            args: {},
        });
    }

    async getContracts(): Promise<
        Array<{
            projectAddress: string;
            projectName: string;
            projectBackgroundUrl: string;
            ownerId: string;
            totalSupply: number;
            price: string;
            metadata: {
                spec: string;
                name: string;
                symbol: string;
                icon: null;
                base_uri: null;
                reference: null;
                reference_hash: null;
            };
            reservedTokenIds: string[];
            saleOpening: string;
            saleClose: string;
        }>
    > {
        console.log('Requesting all contracts');

        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'get_contracts',
            args: {},
        });
    }

    async supplyForOwner() {
        const account_id = this.wallet.accountId;

        console.log('Requesting contracts for account:', account_id);

        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'supply_for_owner',
            args: { account_id },
        });
    }

    async contractsForOwner(accountId: string) {
        console.log('Requesting contracts for account:', accountId);

        try {
            return await this.wallet.viewMethod({
                contractId: this.contractId,
                method: 'contracts_for_owner',
                args: { account_id: accountId },
            });
        } catch (error) {
            console.error('contractsForOwner Error:', error);
            return [];
        }
    }

    async getRequiredDeposit() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'get_required_deposit',
            args: {},
        });
    }

    /* 
        CALL METHODS
    */
    async new() {
        return await this.wallet.callMethod({
            contractId: this.contractId,
            method: 'new',
            args: {},
        });
    }

    async createToken(args: DeployArgs) {
        const THREE_HUNDRED_TGAS = (300 * 1e12).toString();
        const SIX_NEAR = parseNearAmount('6')!;

        return await this.wallet.callMethod({
            contractId: this.contractId,
            method: 'create_token',
            args: { args },
            gas: THREE_HUNDRED_TGAS,
            deposit: SIX_NEAR,
        });
    }

    async storageDeposit(recipientAccount?: string) {
        return await this.wallet.callMethod({
            contractId: this.contractId,
            method: 'storage_deposit',
            args: { recipient_account: recipientAccount },
        });
    }
}

export class PartTokenInterface extends InterfaceFields {
    constructor(contractId: string, wallet: NearWallet) {
        super(contractId, wallet);
    }

    /* 
    CALL METHODS
  */
    async init(args: DeployArgs) {
        return await this.wallet.callMethod({
            contractId: this.contractId,
            method: 'init',
            args,
        });
    }

    // Create Property Distribution Scheme
    async initProperty(
        contractId: string,
        args: { totalSupply: number; distributionStart: string; reservedTokenIds: string[] }
    ) {
        try {
            return await this.wallet.callMethod({
                contractId,
                method: 'init_properties',
                // method: 'init_property',
                args,
            });
        } catch (error) {
            console.error('initProperty Error:', error);
            throw error;
        }
    }

    // Create Property Distribution Scheme
    async postPresaleProceedToSale(contractId: string, projectTitle: string, price: string) {
        try {
            return await this.wallet.callMethod({
                contractId,
                method: 'postpresale_proceed_to_sale',
                args: {
                    metadata: {
                        title: `${projectTitle} PART Token`,
                        description: 'Token ID is your ranking.',
                        media: 'https://bafybeiftczwrtyr3k7a2k4vutd3amkwsmaqyhrdzlhvpt33dyjivufqusq.ipfs.dweb.link/goteam-gif.gif',
                    },
                },
                deposit: price,
            });
        } catch (error) {
            console.error('postpresale_proceed_to_sale Error:', error);
            throw error;
        }
    }

    async archiveContract(contractId: string, isArchived = true) {
        try {
            return await this.wallet.callMethod({
                contractId,
                method: 'archive_contract',
                args: {
                    isArchived,
                },
            });
        } catch (error) {
            console.error('archive_contract Error:', error);
            throw error;
        }
    }

    async participatePresale(contractId: string, price: string) {
        const THREE_HUNDRED_TGAS = (300 * 1e12).toString();
        const NearAmount = parseNearAmount(price)!;

        return await this.wallet.callMethod({
            contractId: contractId,
            //@ts-ignore
            // depositYocto: price,
            method: 'participate_presale',
            args: {},
            gas: THREE_HUNDRED_TGAS,
            deposit: NearAmount,
        });
    }

    async distributeAfterPresale(contractId: string) {
        return await this.wallet.callMethod({
            contractId,
            method: 'distribute_after_presale',
            args: {},
        });
    }

    async cashoutUnluckyPresaleParticipants() {
        return await this.wallet.callMethod({
            contractId: this.contractId,
            method: 'cashout_unlucky_presale_participants',
            args: {},
        });
    }

    async mintForPresaleParticipants(metadata: TokenMetadata) {
        return await this.wallet.callMethod({
            contractId: this.contractId,
            method: 'mint_for_presale_participants',
            args: { metadata },
        });
    }

    async nftMint(contractId: string, projectTitle: string, price: string) {
        console.log('nftMint', contractId, projectTitle, price);

        try {
            return await this.wallet.callMethod({
                contractId,
                method: 'nft_mint',
                args: {
                    metadata: {
                        title: `${projectTitle} PART Token`,
                        description: 'Token ID is your ranking.',
                        media: 'https://bafybeiftczwrtyr3k7a2k4vutd3amkwsmaqyhrdzlhvpt33dyjivufqusq.ipfs.dweb.link/goteam-gif.gif',
                    },
                },
                // deposit: price,
            });
        } catch (error) {
            console.error('nft_mint Error:', error);
            throw error;
        }
    }

    async initProperties(initArgs: InitializePropertiesArgs) {
        return await this.wallet.callMethod({
            contractId: this.contractId,
            method: 'init_properties',
            args: initArgs,
        });
    }

    async setPreferencesProperties({
        contractId,
        token_id,
        propertyPreferenceIds,
    }: {
        contractId: string;
        token_id: string;
        propertyPreferenceIds: string[];
    }) {
        return await this.wallet.callMethod({
            contractId,
            method: 'set_preferences_properties',
            args: { token_id, propertyPreferenceIds },
        });
    }

    async distributeProperties(contractId: string) {
        return await this.wallet.callMethod({
            contractId,
            method: 'distribute_properties',
            args: {},
        });
    }

    async payoutNear(contractId: string, receivingAccountId: string) {
        return await this.wallet.callMethod({
            contractId: contractId,
            method: 'payout_near',
            args: {
                receivingAccountId,
            },
        });
    }

    /* 
    VIEW METHODS
  */

    async nft_total_supply() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'nft_total_supply',
            args: {},
        });
    }

    async nft_tokens() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'nft_tokens',
            args: {},
        });
    }

    async nft_tokens_for_owner(contractId: string): Promise<
        Array<{
            token_id: string;
            owner_id: string;
            metadata: {
                spec: string;
                name: string;
                symbol: string;
                icon: null;
                base_uri: null;
                reference: null;
                reference_hash: null;
                description: string;
            };
            approved_account_ids: {};
        }>
    > {
        return await this.wallet.viewMethod({
            contractId: contractId,
            method: 'nft_tokens_for_owner',
            args: { account_id: this.wallet.accountId },
        });
    }

    async nft_supply_for_owner() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'nft_supply_for_owner',
            args: {},
        });
    }

    async properties_info(account_id: any) {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'properties_info',
            args: { account_id },
        });
    }

    async property_info(contractId: string) {
        return await this.wallet.viewMethod({
            contractId,
            method: 'property_info',
            args: {
                id: 'fff_demo_project',
            },
        });
    }

    async property_preferences(contractId: string): Promise<
        Array<{
            [key: string]: {
                propertyPreferenceIds: string[];
                whichPreferenceIsServed: string;
            };
        }>
    > {
        return await this.wallet.viewMethod({
            contractId,
            method: 'property_preferences',
            args: {},
        });
    }

    async contract_vars(contractId: string, currentDate = new Date()) {
        try {
            const contractVars: ContractVars = await this.wallet.viewMethod({
                contractId: contractId, // 'fff_demo_project.part_factory.groundone.testnet',
                method: 'contract_vars',
                args: {},
            });
            const reservedTokens = convertPropertyIdsToIdString(contractVars.reservedTokenIds ?? []);
            const saleOpeningDate = new Date(+contractVars.saleOpening / 1e6);
            const saleCloseDate = new Date(+contractVars.saleClose / 1e6);
            const priceLabel = (+(contractVars?.price ?? 1e26) / 1e24).toFixed(2);
            let distributionStartDate: Date | undefined;
            if (contractVars.distributionStart) {
                distributionStartDate = new Date(+contractVars.distributionStart / 1e6);
            }

            let highestAvailableRanking = 0;
            const reservedTokenList = contractVars.reservedTokenIds.map((tokenId) => +tokenId);
            for (let i = 0; i <= contractVars.soldTokens; i++) {
                highestAvailableRanking++;
                while (reservedTokenList.includes(highestAvailableRanking)) {
                    highestAvailableRanking++;
                }
            }

            const frontEndStatus =
                currentDate < saleOpeningDate
                    ? 'Presale'
                    : currentDate < saleCloseDate
                    ? 'PostPresale_Distribution'
                    : 'PostPresale_ProceedToSale';

            const contractVarsParsed: ContractVarsParsed = {
                reservedTokens,
                ...contractVars,
                frontEndStatus,
                saleOpeningDate,
                saleCloseDate,
                distributionStartDate,
                priceLabel,
                highestAvailableRanking,
            };

            return contractVarsParsed;
        } catch (error) {
            console.log('contract_vars error', error);
            throw error;
        }
    }

    async property_vars() {
        try {
            const propertyVars = await this.wallet.viewMethod({
                contractId: this.contractId,
                method: 'property_vars',
                args: {},
            });
            const distributionStartDate = new Date(+propertyVars.distributionStart / 1e6);
            const propertyVarsParsed = {
                ...propertyVars,
                distributionStartDate,
            };

            return propertyVarsParsed;
        } catch (error) {
            console.log('property_vars error', error);
            throw error;
        }
    }

    async nft_metadata() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'nft_metadata',
            args: {},
        });
    }

    async presale_participants() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'presale_participants',
            args: {},
        });
    }

    async presale_distribution() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'presale_distribution',
            args: {},
        });
    }

    async current_properties() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'current_properties',
            args: {},
        });
    }

    async distributed_properties(contractId: string) {
        return await this.wallet.viewMethod({
            contractId,
            method: 'distributed_properties',
            args: {},
        });
    }

    async isPresaleDone() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'isPresaleDone',
            args: {},
        });
    }

    async isSaleDone() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'isSaleDone',
            args: {},
        });
    }

    async isPropertySelectionDone() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'isPropertySelectionDone',
            args: {},
        });
    }

    async isDistributionDone() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'isDistributionDone',
            args: {},
        });
    }

    async current_block_time() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'current_block_time',
            args: {},
        });
    }
}
