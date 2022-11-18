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

    const getContracts = async () => {
        const allContracts = await contract.getContracts();
        console.log('allContracts', allContracts);
        let ownerTokens = await Promise.all(
            allContracts.map((c) =>
                tokenContract.nft_tokens_for_owner(c.projectAddress + constants.CONTRACT_ADDRESS_SUFFIX)
            )
        );
        console.log('ownerTokens', ownerTokens);
        const allTokens = ownerTokens.flat();
        const tokenInfo = allTokens.map((t) => ({
            token: t,
            contract: allContracts.find((c) => c.projectAddress === t.metadata.symbol),
        }));
        // const purchasedTokens = allTokens.filter(
        //     (t) =>
        //         !allContracts.find((c) => c.projectAddress === t.metadata.symbol)!.reservedTokenIds.includes(t.token_id)
        // );
        // console.log('purchasedTokens', purchasedTokens);
        console.log('tokenInfo', tokenInfo);

        setTokens(tokenInfo);
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
            {tokens.map((tokenInfo, i) => {
                return (
                    <section
                        className="m2 relative my-4 mr-12 flex flex-col gap-3 rounded-3xl border border-black py-4 px-6"
                        key={i}
                    >
                        <p>
                            Project name: <span className="font-semibold">{tokenInfo.token.metadata?.name}</span>
                        </p>
                        <p>
                            Project address: <span className="font-semibold">{tokenInfo.token.metadata?.symbol}</span>
                        </p>
                        <p>
                            Your PART ranking: <span className="font-semibold">{tokenInfo.token?.token_id}</span>
                        </p>
                        <p>
                            Status: <span className="font-semibold">{tokenInfo.contract?.metadata?.status}</span>
                        </p>

                        {/* <div>
                            Project Name:{' '}
                            <span className="font-semibold">{JSON.stringify(tokenInfo, undefined, 2)}</span>
                        </div> */}
                    </section>
                );
            })}
        </>
    );
}
