import Link from 'next/link';
import { ContractVarsParsed } from '../../utils/near-interface';
import Button from '../ui-components/Button';
import SendCopyToEmail from '../ui-components/SendCopyToEmail';

const PropertySelectionReceipt: React.FC<{
    contractVars: ContractVarsParsed;
    transactionHashes: string;
    selectedProperties: string[];
}> = ({ contractVars, transactionHashes, selectedProperties }) => {
    const userLocale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

    const receiptInfo = (
        <div>
            <h1 className="text-lg font-semibold">Favorite Properties Registered</h1>
            <p className="mt-4">
                Your favourite properties for project <b>{contractVars?.projectName}</b> are now live on the NEAR
                blockchain.
            </p>
            <p className="mt-4">
                Your favourite properties from most favourite to least favourite:{' '}
                <b>{selectedProperties.map((p) => `#${p.padStart(3, '0')}`).join(', ')}</b>.
            </p>
            <p className="mt-4">
                Properties will be assigned on{' '}
                <b>
                    {contractVars?.distributionStartDate?.toLocaleString(userLocale, {
                        timeZoneName: 'short',
                    })}
                </b>
                . Please check your account after this to see which property you have been assigned.
            </p>
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

    return <SendCopyToEmail subject="GroundOne: Favorite properties registered">{receiptInfo}</SendCopyToEmail>;
};
export default PropertySelectionReceipt;
