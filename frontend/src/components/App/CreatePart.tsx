import { useContext } from 'react';
import AppCard from '../ui-components/AppCard';
import { useAsync } from '../../utils/useAsync';
import { WalletState, NearContext } from '../walletContext';
import CreatePartForm, { PartFormValue } from './CreatePartForm';

export default function CreatePart() {
    const { walletState, contract } = useContext(NearContext);

    const nftTokensCall = useAsync(contract.get.nftTokens);

    const runViewMethod = async () => {
        console.log(walletState);
        if (walletState === WalletState.SignedIn) {
            nftTokensCall.execute().then(() => {
                console.log(nftTokensCall.value);
            });
        }
    };

    const onCreatePart = (part: PartFormValue) => {
        console.log('Part: ', part);
        runViewMethod();
    };

    return (
        <AppCard>
            <div className="font-semibold">Create PART Scheme</div>
            <CreatePartForm onCreatePartRequest={onCreatePart} />
        </AppCard>
    );
}
