import { useContext, useEffect } from 'react';
import { InitializeArgs } from '../../../../contracts/part-token/src/types';
import { NFTContractMetadata } from '../../utils/partToken';
import { useAsync } from '../../utils/useAsync';
import AppCard from '../ui-components/AppCard';
import { NearContext, WalletState } from '../walletContext';
import CreatePartForm, { PartFormValue } from './CreatePartForm';

export const NFT_STANDARD_NAME = 'nep171';

export default function CreatePart() {
    const { wallet, walletState, contract } = useContext(NearContext);

    // const nftTokensCall = useAsync(() => );
    useEffect(() => {
        async function getContracts() {
            const contracts = await contract.getContracts();

            console.log('contracts', contracts);
        }
        getContracts();
    }, [contract]);

    const runViewMethod = async (args: InitializeArgs) => {
        console.log('runViewMethod', walletState);

        if (walletState === WalletState.SignedIn) {
            console.log('signed in', walletState);
            // nftTokensCall.execute().then(() => {
            //     console.log('nftTokensCall.execute', nftTokensCall.value);
            // });

            const result = await contract.createToken(args);
            console.log('created contract', result);
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

        runViewMethod({
            ownerId: wallet.accountId!,
            projectName,
            totalSupply: part.partAmount,
            price: part.partPrice,
            reservedTokenIds,
            reservedTokenOwner: part.reservePartsAddress,
            saleOpening: part.saleOpeningBlock.getTime().toString(),
            saleClose: part.saleCloseBlock.getTime().toString(),
            metadata: new NFTContractMetadata({
                spec: NFT_STANDARD_NAME,
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
