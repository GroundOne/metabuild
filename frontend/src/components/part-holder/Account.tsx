import { useCallback, useContext, useEffect, useState } from 'react';
import Button from '../ui-components/Button';
import { NearContext, WalletState } from '../walletContext';
import { useRouter } from 'next/router';
import { debounce } from '../../utils/common';
import constants from '../../constants';

export default function Account() {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const { walletState, contract, tokenContract } = useContext(NearContext);
    const [tokens, setTokens] = useState<any[]>([]);

    const userLocale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

    // TEST CODE
    useEffect(() => {
        const myTokens = async () => {
            const tokens = await tokenContract.nft_tokens_for_owner(
                'demo_project_test15.part_factory.groundone.testnet'
            );
            console.log('TEST tokens', tokens);
        };
        myTokens();
    }, [tokenContract]);

    const getContracts = async (forDate: Date) => {
        const allContracts: Array<{ projectAddress: string }> = await contract.getContracts();
        console.log('allContracts', allContracts);
        const ownerTokens = await Promise.all(
            allContracts.map((c) =>
                tokenContract.nft_tokens_for_owner(c.projectAddress + constants.CONTRACT_ADDRESS_SUFFIX)
            )
        );
        console.log('ownerTokens', ownerTokens, ownerTokens.flat());
        setTokens(ownerTokens.flat());
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadContracts = useCallback(
        debounce(getContracts, 400),
        // add function dependencies in the useEffect hook for loadContracts() otherwise debounce will not work
        []
    );

    useEffect(() => {
        loadContracts(currentDate);
    }, [contract, tokenContract, currentDate, loadContracts]);

    return (
        <>
            <div className="mr-12 flex justify-between">
                <div className="mb-4 text-lg font-semibold">Your PARTs</div>
            </div>
            {tokens.map((token, i) => {
                return (
                    <section
                        className="m2 relative my-4 mr-12 flex flex-col gap-3 rounded-3xl border border-black py-4 px-6"
                        key={i}
                    >
                        <div>
                            Project Name: <span className="font-semibold">{JSON.stringify(token, undefined, 2)}</span>
                        </div>
                    </section>
                );
            })}
        </>
    );
}
