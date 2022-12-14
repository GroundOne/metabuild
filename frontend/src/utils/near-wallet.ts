/* A helper file that simplifies using the wallet selector */

// near api js
import { providers } from 'near-api-js';

// wallet selector UI
import { setupModal } from '@near-wallet-selector/modal-ui';
import '@near-wallet-selector/modal-ui/styles.css';

// import LedgerIconUrl from '@near-wallet-selector/ledger/assets/ledger-icon.png';
// import MyNearIconUrl from '@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png';

// wallet selector options
import { Network, NetworkId, setupWalletSelector, Wallet, WalletSelector } from '@near-wallet-selector/core';
import { setupLedger } from '@near-wallet-selector/ledger';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

const LedgerIconUrl = '/images/icons/ledger-icon.png';
const MyNearIconUrl = '/images/icons/my-near-wallet-icon.png';
const THIRTY_TGAS = '30000000000000';
const NO_DEPOSIT = '0';

// Wallet that simplifies using the wallet selector
export class NearWallet {
    walletSelector: WalletSelector | null;
    wallet: Wallet | null = null;
    network: NetworkId | Network;
    createAccessKeyFor: string | null;
    accountId: string | null;

    constructor({ createAccessKeyFor, network = 'testnet' }: { createAccessKeyFor: string; network?: NetworkId }) {
        // Login to a wallet passing a contractId will create a local
        // key, so the user skips signing non-payable transactions.
        // Omitting the accountId will result in the user being
        // asked to sign all transactions.
        this.createAccessKeyFor = createAccessKeyFor;
        this.network = network;

        this.walletSelector = null;
        this.accountId = null;
    }

    // To be called when the website loads
    startUp = async () => {
        this.walletSelector = await setupWalletSelector({
            network: this.network,
            modules: [setupMyNearWallet({ iconUrl: MyNearIconUrl }), setupLedger({ iconUrl: LedgerIconUrl })],
        });
        const isSignedIn = this.walletSelector.isSignedIn();

        if (isSignedIn) {
            this.wallet = await this.walletSelector.wallet();
            this.accountId = this.walletSelector.store.getState().accounts[0].accountId;
        }

        return isSignedIn;
    };

    // Sign-in method
    signIn = async () => {
        const description = 'Please select a wallet to sign in.';
        const modal = setupModal(this.walletSelector!, { contractId: this.createAccessKeyFor!, description });
        modal.show();
    };

    // Sign-out method
    signOut = () => {
        if (this.wallet) {
            this.wallet.signOut();
            this.wallet = this.accountId = this.createAccessKeyFor = null;
            window.location.replace(window.location.origin + window.location.pathname);
        }
    };

    // Make a read-only call to retrieve information from the network
    viewMethod = async ({
        contractId,
        method,
        args = {},
    }: {
        contractId: string;
        method: string;
        args: Record<string, any>;
    }) => {
        if (!this.walletSelector) {
            console.error(`Wallet selector not properly configure. Please log into wallet again!`);
            return;
        }

        const { network } = this.walletSelector.options;
        const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

        const res = await provider.query({
            request_type: 'call_function',
            account_id: contractId,
            method_name: method,
            args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
            finality: 'optimistic',
        });

        // @ts-ignore
        return JSON.parse(Buffer.from(res.result).toString());
    };

    // Call a method that changes the contract's state
    callMethod = async ({
        contractId,
        method,
        args = {},
        gas = THIRTY_TGAS,
        deposit = NO_DEPOSIT,
    }: {
        contractId: string;
        method: string;
        args: Record<string, any>;
        gas?: string;
        deposit?: string;
    }) => {
        // Sign a transaction with the "FunctionCall" action
        const outcome = (await this.wallet!.signAndSendTransaction({
            signerId: this.accountId!,
            receiverId: contractId,
            actions: [
                {
                    type: 'FunctionCall',
                    params: { methodName: method, args, gas, deposit },
                },
            ],
        })) as providers.FinalExecutionOutcome;

        return providers.getTransactionLastResult(outcome);
    };

    // Get transaction result from the network
    getTransactionResult = async (txhash: string) => {
        if (!this.walletSelector) {
            console.error(`Wallet selector not properly configure. Please log into wallet again!`);
            return;
        }

        const { network } = this.walletSelector.options;
        const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

        // Retrieve transaction result from the network
        const transaction = await provider.txStatus(txhash, 'unused');
        return providers.getTransactionLastResult(transaction);
    };
}
