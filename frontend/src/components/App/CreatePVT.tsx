import { useCallback, useContext, useRef, useState } from 'react';
import AppCard from '../ui-components/AppCard';
import Button from '../ui-components/Button';
import Input from '../ui-components/Input';
import { NearContext } from '../walletContext';

const methods = {
    factory: {
        view: [
            { getNumberOfTokens: [] },
            { getContracts: [] },
            { supplyForOwner: [] },
            { contractsForOwner: [] },
            { contractsForOwner: ['fff_demo_project.part_factory.groundone.testnet'] }, // Trying with this contract id
            { getRequiredDeposit: [] },
        ],
        call: [{ new: [] }, { createToken: [] }, { storageDeposit: [] }],
    },
    token: {
        view: [
            { nft_metadata: [] },
            { contract_vars: [] },
            { nft_tokens_for_owner: [] },
            { nft_total_supply: [] },
            { nft_tokens: [] },
            { nft_supply_for_owner: [] },
            { properties_info: [] },
            { property_info: [] },
            { property_vars: [] },
            { presale_participants: [] },
            { presale_distribution: [] },
            { current_properties: [] },
            { distributed_properties: [] },
            { isPresaleDone: [] },
            { isSaleDone: [] },
            { isPropertySelectionDone: [] },
            { isDistributionDone: [] },
            { current_block_time: [] },
        ],
        call: [
            { init: [] },
            { participatePresale: [] },
            { distributeAfterPresale: [] },
            { cashoutUnluckyPresaleParticipants: [] },
            { mintForPresaleParticipants: [] },
            { nftMint: [] },
            { initProperties: [] },
            { setPreferencesProperties: [] },
            { distributePropertie: [] },
            { payoutNear: [] },
        ],
    },
};

export default function CreatePVT() {
    const { contract, contractId, setContractId, tokenContract } = useContext(NearContext);
    const inputRef = useRef<HTMLInputElement>(null);
    const [factoryOutput, setFactoryOutput] = useState('');
    const [tokenOutput, setTokenOutput] = useState('');

    const factoryInterface = useCallback(async (fn: string, args: [] = []) => {
        try {
            // @ts-ignore
            const value = await contract[fn](...args);
            setFactoryOutput(JSON.stringify(value, undefined, 2));
            console.log(value);
        } catch (error) {
            setFactoryOutput('ERROR: ' + JSON.stringify(error, undefined, 2));
        }
    }, []);
    const tokenInterface = useCallback(async (fn: string, args: [] = []) => {
        try {
            // @ts-ignore
            const value = await tokenContract[fn](...args);
            setTokenOutput(JSON.stringify(value, undefined, 2));
            console.log(value);
        } catch (error) {
            setTokenOutput('ERROR: ' + JSON.stringify(error, undefined, 2));
        }
    }, []);

    return (
        <>
            <AppCard>
                <div className="font-semibold">Contract Info</div>
                <div>
                    Active contract: <span className="font-semibold">{contractId}</span>
                </div>
                <Input
                    className="inline-flex min-w-[280px]"
                    ref={inputRef}
                    id="contract_id"
                    name="contract_id"
                    placeholder=""
                    type="text"
                />
                <Button
                    isInvertedColor
                    size="sm"
                    onClick={() => inputRef.current && setContractId(inputRef.current.value)}
                >
                    Update contract
                </Button>
                <Button
                    isInvertedColor
                    className="ml-3"
                    size="sm"
                    onClick={() => setContractId('fff_demo_project.part_factory.groundone.testnet')}
                >
                    Set to "fff_demo..."
                </Button>
                <Button
                    isInvertedColor
                    className="ml-3"
                    size="sm"
                    onClick={() => setContractId('futuristic_build.part_factory.groundone.testnet')}
                >
                    Set to "futuristic..."
                </Button>
            </AppCard>

            <AppCard>
                <div className="font-semibold">Contract Factory</div>
                {factoryOutput && (
                    <pre className="border-grey relative border p-2">
                        <Button
                            isInvertedColor
                            className="absolute top-1 right-1"
                            size="sm"
                            onClick={() => setFactoryOutput('')}
                        >
                            Clear
                        </Button>
                        {factoryOutput}
                    </pre>
                )}
                <section>
                    <div>View Methods</div>
                    {methods.factory.view.map((method) => (
                        <Button
                            isInvertedColor
                            className="m-1"
                            size="sm"
                            onClick={() => factoryInterface(...Object.entries(method)[0])}
                        >
                            {Object.keys(method)[0]}
                        </Button>
                    ))}
                    <div>Call Methods</div>
                    {methods.factory.call.map((method) => (
                        <Button
                            isInvertedColor
                            className="m-1"
                            size="sm"
                            onClick={() => factoryInterface(...Object.entries(method)[0])}
                        >
                            {Object.keys(method)[0]}
                        </Button>
                    ))}
                </section>
            </AppCard>

            <AppCard>
                <div className="font-semibold">Token Contract</div>
                {tokenOutput && (
                    <pre className="border-grey relative border p-2">
                        <Button
                            isInvertedColor
                            className="absolute top-1 right-1"
                            size="sm"
                            onClick={() => setTokenOutput('')}
                        >
                            Clear
                        </Button>
                        {tokenOutput}
                    </pre>
                )}
                <section>
                    <div>View Methods</div>
                    {methods.token.view.map((method) => (
                        <Button
                            isInvertedColor
                            className="m-1"
                            size="sm"
                            onClick={() => tokenInterface(...Object.entries(method)[0])}
                        >
                            {Object.keys(method)[0]}
                        </Button>
                    ))}
                    <div>Call Methods</div>
                    {methods.token.call.map((method) => (
                        <Button
                            isInvertedColor
                            className="m-1"
                            size="sm"
                            onClick={() => tokenInterface(...Object.entries(method)[0])}
                        >
                            {Object.keys(method)[0]}
                        </Button>
                    ))}
                </section>
            </AppCard>
        </>
    );
}
