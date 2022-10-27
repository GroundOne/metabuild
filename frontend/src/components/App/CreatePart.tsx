import { NetworkId } from '@near-wallet-selector/core';
import { useContext, useEffect } from 'react';
import { PartTokenInterface } from '../../utils/near-interface';
import { NearWallet } from '../../utils/near-wallet';
import { DeployArgs, NFTContractMetadata, InitializeArgs } from '../../utils/partToken';
import { useAsync } from '../../utils/useAsync';
import AppCard from '../ui-components/AppCard';
import { NearContext, WalletState } from '../walletContext';
import CreatePartForm, { PartFormValue } from './CreatePartForm';

export const NFT_METADATA_SPEC = 'nft-1.0.0';

export default function CreatePart() {
    const { wallet, walletState, contract, getPartTokenWalletAndContract } = useContext(NearContext);

    // const nftTokensCall = useAsync(() => );
    useEffect(() => {
        async function getContracts() {
            const contracts = await contract.getContracts();

            console.log('contracts', contracts);
        }
        getContracts();
    }, [contract]);

    const deployAndInitTokenContract = async (args: InitializeArgs) => {
        console.log('deployAndInitTokenContract', walletState);

        if (walletState === WalletState.SignedIn) {
            console.log('signed in', walletState);
            // nftTokensCall.execute().then(() => {
            //     console.log('nftTokensCall.execute', nftTokensCall.value);
            // });

            const result = await contract.createToken({
                projectName: args.projectName,
                metadata: args.metadata,
            });
            console.log('created contract', result);

            const { partTokenContract } = getPartTokenWalletAndContract(args.projectName);
            await partTokenContract.init(args);
        }
    };

    const onCreatePart = (part: PartFormValue) => {
        const projectName = part.projectName.replaceAll(' ', '_').replaceAll('-', '_').toLowerCase();

        const reservedTokenIds = (part.reserveParts ?? '')
            .replace(/\s+/g, '') // remove spaces
            .split(';')
            .flatMap((range) => {
                const [from, to] = range.split('-').map((num) => parseInt(num, 10));
                return to ? Array.from({ length: to - from + 1 }, (_, i) => from + i) : [from];
            })
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort((a, b) => a - b)
            .map((value) => value.toString());

        deployAndInitTokenContract({
            ownerId: wallet.accountId!,
            projectName,
            // @ts-ignore
            totalSupply: `${part.partAmount}`,
            // @ts-ignore
            price: `${part.partPrice}`,
            reservedTokenIds,
            reservedTokenOwner: part.reservePartsAddress,
            saleOpening: part.saleOpeningBlock.getTime().toString(),
            saleClose: part.saleCloseBlock.getTime().toString(),
            metadata: new NFTContractMetadata({
                spec: NFT_METADATA_SPEC,
                name: projectName,
                symbol: projectName,
            }),
        });
    };

    return (
        <AppCard>
            <div className="font-semibold">Create PART Scheme</div>
            <CreatePartForm onCreatePartRequest={onCreatePart} />
        </AppCard>
    );
}
