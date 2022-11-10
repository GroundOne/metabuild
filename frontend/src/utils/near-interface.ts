import { parseNearAmount } from 'near-api-js/lib/utils/format';

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

    async getContracts() {
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

    async contractsForOwner(accountId?: string) {
        const account_id = accountId ?? this.wallet.accountId;

        console.log('Requesting contracts for account:', account_id);

        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'contracts_for_owner',
            args: { account_id },
        });
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

    async participatePresale() {
        return await this.wallet.callMethod({
            contractId: this.contractId,
            method: 'participate_presale',
            args: {},
        });
    }

    async distributeAfterPresale() {
        return await this.wallet.callMethod({
            contractId: this.contractId,
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

    async nftMint(args: { metadata: TokenMetadata; receiver_id: string }) {
        return await this.wallet.callMethod({
            contractId: this.contractId,
            method: 'nft_mint',
            args,
        });
    }

    async initProperties(initArgs: InitializePropertiesArgs) {
        return await this.wallet.callMethod({
            contractId: this.contractId,
            method: 'init_properties',
            args: initArgs,
        });
    }

    async setPreferencesProperties(propertyPreferenceIds: string[]) {
        return await this.wallet.callMethod({
            contractId: this.contractId,
            method: 'set_preferences_properties',
            args: propertyPreferenceIds,
        });
    }

    async distributeProperties() {
        return await this.wallet.callMethod({
            contractId: this.contractId,
            method: 'distribute_properties',
            args: {},
        });
    }

    async payoutNear({ amount, receivingAccountId }: { amount: number; receivingAccountId: string }) {
        return await this.wallet.callMethod({
            contractId: this.contractId,
            method: 'payout_near',
            args: { amount, receivingAccountId },
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

    async nft_tokens_for_owner() {
        // console.log(this.wallet.account_id);
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'nft_tokens_for_owner',
            args: {},
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

    async property_info() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'property_info',
            args: {
                id: 'fff_demo_project',
            },
        });
    }

    async contract_vars(contractId?: string) {
        return await this.wallet.viewMethod({
            contractId: contractId ?? this.contractId, // 'fff_demo_project.part_factory.groundone.testnet',
            method: 'contract_vars',
            args: {},
        });
    }

    async property_vars() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'property_vars',
            args: {},
        });
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

    async distributed_properties() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
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
