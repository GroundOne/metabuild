import { TokenMetadata } from './../../../contracts/part-token/src/metadata';
import { InitializeArgs, InitializePropertiesArgs } from './../../../contracts/part-token/src/types';
/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

import { NearWallet } from './near-wallet';

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
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'get_contracts',
            args: {},
        });
    }

    async supplyForOwner() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'supply_for_owner',
            args: {},
        });
    }

    async contractsForOwner() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'contracts_for_owner',
            args: {},
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

    async createToken(args: InitializeArgs) {
        return await this.wallet.callMethod({
            contractId: this.contractId,
            method: 'create_token',
            args: { args },
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
    async init(args: InitializeArgs) {
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
        });
    }

    async nft_tokens() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'nft_tokens',
        });
    }

    async nft_tokens_for_owner() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'nft_tokens_for_owner',
        });
    }

    async nft_supply_for_owner() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'nft_supply_for_owner',
        });
    }

    async properties_info() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'properties_info',
        });
    }

    async property_info() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'property_info',
        });
    }

    async contract_vars() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'contract_vars',
        });
    }

    async property_vars() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'property_vars',
        });
    }

    async nft_metadata() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'nft_metadata',
        });
    }

    async presale_participants() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'presale_participants',
        });
    }

    async presale_distribution() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'presale_distribution',
        });
    }

    async current_properties() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'current_properties',
        });
    }

    async distributed_properties() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'distributed_properties',
        });
    }

    async isPresaleDone() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'isPresaleDone',
        });
    }

    async isSaleDone() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'isSaleDone',
        });
    }

    async isPropertySelectionDone() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'isPropertySelectionDone',
        });
    }

    async isDistributionDone() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'isDistributionDone',
        });
    }

    async current_block_time() {
        return await this.wallet.viewMethod({
            contractId: this.contractId,
            method: 'current_block_time',
        });
    }
}
