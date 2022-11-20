import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import constants from '../../constants';
import { debounce } from '../../utils/common';
import Button from '../ui-components/Button';
import { NearContext } from '../walletContext';

export default function Account() {
    const router = useRouter();
    const { contract, tokenContract } = useContext(NearContext);
    const [tokens, setTokens] = useState<TokenInfo[]>([]);

    type TokenInfo = {
        token: Awaited<ReturnType<typeof tokenContract.nft_tokens_for_owner>>[0];
        contractVars: Awaited<ReturnType<typeof tokenContract.contract_vars>>;
    };

    const getContracts = async () => {
        const allContracts = await contract.getContracts();
        console.log('allContracts', allContracts);

        const contractVars = await Promise.all(
            allContracts.map((c) => tokenContract.contract_vars(c.projectAddress + constants.CONTRACT_ADDRESS_SUFFIX))
        );

        const ownerTokens = await Promise.all(
            allContracts.map((c) =>
                tokenContract
                    .nft_tokens_for_owner(c.projectAddress + constants.CONTRACT_ADDRESS_SUFFIX)
                    .then((tokens) =>
                        tokens.map((token) => ({
                            token,
                            contractVars: contractVars.find(
                                (cv) => cv.projectAddress === c.projectAddress + constants.CONTRACT_ADDRESS_SUFFIX
                            )!,
                        }))
                    )
            )
        );

        const allTokens = ownerTokens.flat().filter((t) => !t.contractVars.isArchived);
        console.log('🚀 ~ file: Account.tsx ~ line 44 ~ //userTokenInfo ~ allTokens', allTokens);
        setTokens(allTokens);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadContracts = useCallback(
        debounce(getContracts, 400),
        // add function dependencies in the useEffect hook for loadContracts() otherwise debounce will not work
        []
    );

    useEffect(() => {
        loadContracts();
    }, [contract, tokenContract, loadContracts]);

    return (
        <>
            <div className="mb-4 text-lg font-semibold">Your PARTs</div>
            {tokens.map((tokenInfo, i) => {
                return (
                    <section
                        className="m2 relative my-4 mr-12 flex flex-col gap-3 rounded-3xl border border-black py-4 px-6"
                        key={i}
                    >
                        <p>
                            Project name: <span className="font-semibold">{tokenInfo.contractVars.projectName}</span>
                        </p>
                        <p>
                            Project address:{' '}
                            <span className="font-semibold">{tokenInfo.contractVars.projectAddress.split('.')[0]}</span>
                        </p>
                        <p>
                            Your PART ranking: <span className="font-semibold">{tokenInfo.token.token_id}</span>
                        </p>
                        <p>
                            Status: <span className="font-semibold">{tokenInfo.contractVars.contractStatus}</span>
                        </p>
                        {tokenInfo.contractVars.contractStatus === 'property_selection' &&
                            tokenInfo.contractVars.distributionStartDate &&
                            tokenInfo.contractVars.distributionStartDate > new Date() && (
                                <Button
                                    isInvertedColor
                                    size="sm"
                                    className="mt-2 w-40"
                                    onClick={() => {
                                        router.push(
                                            `${router.pathname}/property-selection?project=${
                                                tokenInfo.contractVars.projectAddress.split('.')[0]
                                            }&token=${tokenInfo.token.token_id}`
                                        );
                                    }}
                                >
                                    Select Properties
                                </Button>
                            )}
                    </section>
                );
            })}
        </>
    );
}
