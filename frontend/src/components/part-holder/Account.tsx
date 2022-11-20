import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import constants from '../../constants';
import { convertPropertyIdsToIdString, debounce } from '../../utils/common';
import Button from '../ui-components/Button';
import { NearContext } from '../walletContext';

export default function Account() {
    const router = useRouter();
    const { contract, tokenContract } = useContext(NearContext);
    const [tokens, setTokens] = useState<TokenInfo[]>([]);

    type TokenInfo = {
        token: Awaited<ReturnType<typeof tokenContract.nft_tokens_for_owner>>[0];
        contractVars: Awaited<ReturnType<typeof tokenContract.contract_vars>>;
        reservedProperties?: string[];
        distributedProperty?: string;
    };

    const getContracts = async () => {
        const allContracts = await contract.getContracts();
        console.log('allContracts', allContracts);

        const contractVars = (
            (
                await Promise.allSettled(
                    allContracts.map((c) =>
                        tokenContract.contract_vars(c.projectAddress + constants.CONTRACT_ADDRESS_SUFFIX)
                    )
                )
            ).filter((c) => c.status === 'fulfilled') as PromiseFulfilledResult<
                Awaited<ReturnType<typeof tokenContract.contract_vars>>
            >[]
        ).map((c) => c.value);
        console.log('contractVars', contractVars);

        const distributedProperties = (
            (
                await Promise.allSettled(
                    contractVars.map((c) =>
                        tokenContract.distributed_properties(c.projectAddress).then((dp) => ({
                            projectAddress: c.projectAddress,
                            distributedProperties: dp,
                            distributedPropertiesRev: dp.map((r) => {
                                const [k, v] = Object.entries(r)[0];
                                return { [v]: k };
                            }),
                        }))
                    )
                )
            ).filter((c) => c.status === 'fulfilled') as PromiseFulfilledResult<{
                projectAddress: string;
                distributedProperties: Awaited<ReturnType<typeof tokenContract.distributed_properties>>;
                distributedPropertiesRev: Awaited<ReturnType<typeof tokenContract.distributed_properties>>;
            }>[]
        ).map((c) => c.value);
        console.log('🚀 ~ distributedProperties', distributedProperties);

        const propertyPreferences = (
            (
                await Promise.allSettled(
                    contractVars.map((c) =>
                        tokenContract
                            .property_preferences(c.projectAddress)
                            .then((d) => ({ projectAddress: c.projectAddress, propertyPreferences: d }))
                    )
                )
            ).filter((c) => c.status === 'fulfilled') as PromiseFulfilledResult<{
                projectAddress: string;
                propertyPreferences: Awaited<ReturnType<typeof tokenContract.property_preferences>>;
            }>[]
        ).map((c) => c.value);

        const ownerTokens = await Promise.all(
            allContracts
                .filter((c) =>
                    contractVars
                        .map((v) => v.projectAddress)
                        .includes(c.projectAddress + constants.CONTRACT_ADDRESS_SUFFIX)
                )
                .map((c) =>
                    tokenContract
                        .nft_tokens_for_owner(c.projectAddress + constants.CONTRACT_ADDRESS_SUFFIX)
                        .then((tokens) =>
                            tokens.map((token) => ({
                                token,
                                contractVars: contractVars.find(
                                    (cv) => cv.projectAddress === c.projectAddress + constants.CONTRACT_ADDRESS_SUFFIX
                                )!,
                                reservedProperties: propertyPreferences
                                    .find(
                                        (pp) =>
                                            pp.projectAddress === c.projectAddress + constants.CONTRACT_ADDRESS_SUFFIX
                                    )
                                    ?.propertyPreferences.find((pp) => Object.keys(pp)[0] == token.token_id)?.[
                                    token.token_id
                                ].propertyPreferenceIds,
                                distributedProperty: distributedProperties
                                    .find(
                                        (pp) =>
                                            pp.projectAddress === c.projectAddress + constants.CONTRACT_ADDRESS_SUFFIX
                                    )
                                    ?.distributedPropertiesRev.find((dp) => Object.keys(dp)[0] == token.token_id)?.[
                                    token.token_id
                                ],
                            }))
                        )
                )
        );

        const allTokens = ownerTokens.flat().filter((t) => !t.contractVars.isArchived);
        console.log('🚀 ~ allTokens', allTokens);
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
                            Your favourite properties:{' '}
                            <span className="font-semibold">
                                {tokenInfo.reservedProperties
                                    ? convertPropertyIdsToIdString(tokenInfo.reservedProperties)
                                    : 'None'}
                            </span>
                        </p>
                        <p>
                            Your assigned property:{' '}
                            <span className="font-semibold">{tokenInfo.distributedProperty ?? 'None'}</span>
                        </p>
                        <p>
                            Status: <span className="font-semibold">{tokenInfo.contractVars.contractStatus}</span>
                        </p>
                        {tokenInfo.contractVars.contractStatus === 'property_selection' &&
                            tokenInfo.contractVars.distributionStartDate &&
                            tokenInfo.contractVars.distributionStartDate > new Date() &&
                            !tokenInfo.reservedProperties && (
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
