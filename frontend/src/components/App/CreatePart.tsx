import { useContext, useEffect } from 'react';
import { InitializeArgs, NFTContractMetadata } from '../../utils/partToken';
import { NearContext, WalletState } from '../walletContext';
import CreatePartForm, { PartFormValue } from './CreatePartForm';
import { useRouter } from 'next/router';
import constants from '../../constants';

export default function CreatePart() {
    const { wallet, walletState, contract } = useContext(NearContext);
    const router = useRouter();

    // Handle redirect after deploying the contract
    useEffect(() => {
        const urlParams = router.query;
        if (urlParams.transactionHashes) {
            // callback from deploy contract
            if (urlParams.errorCode) {
                // errorCode: "Error" | "userRejected"
                // errorMessage: "Can't%20create%20a%20new%20account%20ff_demo_project.part_factory.groundone.testnet%2C%20because%20it%20already%20exists" | User%2520rejected%2520transaction
                // transactionHashes: "6G7tBRaHDL63SztJVVEyeNV9q5jk69hat5SZzFcTfYWy"
                const errorMessage = decodeURIComponent(urlParams.errorMessage as string) ?? 'Unknown error';
                alert(errorMessage);
            } else {
                // transactionHashes=EBz4gvA9v4ezc59ZnvyfEBUB9ZsXskrxcA2x5aS84G3G
                alert('Contract deployed successfully');
            }
            router.replace(router.pathname);
        }
    }, [router, router.query]);

    const deployAndInitTokenContract = async (args: InitializeArgs) => {
        console.log('deployAndInitTokenContract', walletState);
        if (walletState === WalletState.SignedIn) {
            console.log('signed in', walletState);
            await contract.createToken(args);
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

        const args: InitializeArgs = {
            ownerId: wallet.accountId!,
            projectName,
            // @ts-ignore
            totalSupply: `${part.partAmount}`,
            // @ts-ignore
            price: `${part.partPrice}`,
            reservedTokenIds,
            reservedTokenOwner: part.reservePartsAddress,
            saleOpening: part.saleOpeningDate.getTime().toString(),
            saleClose: part.saleCloseDate.getTime().toString(),
            metadata: new NFTContractMetadata({
                spec: constants.NFT_METADATA_SPEC,
                name: projectName,
                symbol: projectName,
            }),
        };

        deployAndInitTokenContract(args);
    };

    return (
        <>
            <div className="font-semibold">Create PART Scheme</div>
            <CreatePartForm onCreatePartRequest={onCreatePart} />
        </>
    );
}
