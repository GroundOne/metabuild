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
        const reservedPartsArray = (part.reserveParts ?? '')
            .replace(/\s+/g, '') // remove spaces
            .split(';')
            .flatMap((range) => {
                const [from, to] = range.split('-').map((num) => parseInt(num, 10));
                return to ? Array.from({ length: to - from + 1 }, (_, i) => from + i) : [from];
            })
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort((a, b) => a - b);

        console.log('Part: ', part);
        console.log('Reserved parts: ', reservedPartsArray);
        runViewMethod();
    };

    return (
        <AppCard>
            <div className="font-semibold">Create PART Scheme</div>
            <CreatePartForm onCreatePartRequest={onCreatePart} />
        </AppCard>
    );
}
