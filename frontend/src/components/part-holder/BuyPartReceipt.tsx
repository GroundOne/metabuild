import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { ContractVarsParsed } from '../../utils/near-interface';
import Button from '../ui-components/Button';
import SendCopyToEmail from '../ui-components/SendCopyToEmail';
import { NearContext } from '../walletContext';

const BuyPartReceipt: React.FC<{
    contractVars: ContractVarsParsed;
    purchaseOptions: 'participateIRD' | 'buyPart';
    transactionHashes: string;
}> = ({ contractVars, purchaseOptions, transactionHashes }) => {
    const { tokenContract } = useContext(NearContext);

    const [tokenRank, setTokenRank] = useState<string | null>(null);
    const userLocale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

    useEffect(() => {
        if (purchaseOptions === 'buyPart') {
            tokenContract.nft_tokens_for_owner(contractVars.projectAddress).then((tokens) => {
                if (tokens.length) {
                    const token = tokens
                        .map((t) => t.token_id)
                        .sort()
                        .reverse()[0];
                    setTokenRank(token);
                }
            });
        }
    }, [tokenContract, purchaseOptions]);

    const receiptInfo = (
        <div>
            {purchaseOptions === 'participateIRD' && (
                <>
                    {' '}
                    <h1 className="text-lg font-semibold">IRD Registration Confirmed</h1>
                    <p className="mt-4">
                        You are now registered in the IRD of the project <b>{contractVars?.projectName}</b>.
                    </p>
                    <p className="mt-4">
                        The IRD (Initial Random Distribution) will be happening on{' '}
                        <b>
                            {contractVars?.saleOpeningDate.toLocaleString(userLocale, {
                                timeZoneName: 'short',
                            })}
                        </b>
                        .
                    </p>
                    <p className="mt-4">
                        Please check your account after the IRD to see which ranking you have been assigned.
                    </p>
                    <p className="mt-4">
                        If there are more registered users in the IRD than available PARTs, you will be refunded the
                        price of the PART and the Ground One transaction fees.
                    </p>
                </>
            )}
            {purchaseOptions === 'buyPart' && (
                <>
                    {' '}
                    <h1 className="text-lg font-semibold">PART Purchase Confirmed</h1>
                    <p className="mt-4">
                        You have purchased a PART in the project <b>{contractVars?.projectName}</b>.
                    </p>
                    <p className="mt-4">
                        You have been assigned the ranking <b>{tokenRank}</b>.
                    </p>
                    <p className="mt-4">Your PART is now in your wallet.</p>
                </>
            )}
            <p className="mt-4">
                The transaction number is <b>{transactionHashes}</b>.
            </p>
            <div className="mt-3 text-center">
                <Link
                    href={`https://explorer.testnet.near.org/transactions/${transactionHashes}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <Button isInvertedColor size="sm">
                        View on NEAR Explorer
                        <span className="ml-1 mb-1 scale-75">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                />
                            </svg>
                        </span>
                    </Button>
                </Link>
            </div>
        </div>
    );

    return <SendCopyToEmail subject="GroundOne: IRD Registration Confirmed">{receiptInfo}</SendCopyToEmail>;
};
export default BuyPartReceipt;
