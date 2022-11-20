import Link from 'next/link';
import { InitialisationVars } from '../../utils/common';
import { ContractVarsParsed } from '../../utils/near-interface';
import Button from '../ui-components/Button';
import SendCopyToEmail from '../ui-components/SendCopyToEmail';

const PropertyDistributionReceipt: React.FC<{
    contractVars?: ContractVarsParsed;
    transactionHashes?: string;
    distributionVars?: InitialisationVars;
}> = ({ contractVars, transactionHashes, distributionVars }) => {
    const userLocale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

    const receiptInfo = (
        <div>
            <h1 className="text-lg font-semibold">Property Distribution Scheme Creation Receipt</h1>
            <p className="mt-4">
                Your Property Distribution scheme for project <b>{contractVars?.projectName}</b> is now live on the NEAR
                blockchain.
            </p>
            <p className="mt-4">
                Your scheme is registered in the PART contract <b>{contractVars?.projectAddress}</b>.
            </p>
            <p className="mt-4">
                There are <b>{distributionVars?.totalSupply} properties</b> in your scheme numbered from{' '}
                <b>#001 to #{('' + (distributionVars?.totalSupply ?? '')).padStart(3, '0')}</b>.
            </p>
            <p className="mt-4">
                The following properties will be excluded from the distribution{' '}
                <b>{contractVars?.reservedTokenIds.map((x) => '#' + x.padStart(3, '0')).join(', ')}</b>.
            </p>
            <p className="mt-4">
                Distribution of the properties according to PART Scheme <b>{contractVars?.projectAddress}</b> will take
                place on{' '}
                <b>
                    {distributionVars?.distributionStartDate.toLocaleString(userLocale, {
                        timeZoneName: 'short',
                    })}
                </b>
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

    return <SendCopyToEmail subject="GroundOne: Property Distribution Scheme">{receiptInfo}</SendCopyToEmail>;
};
export default PropertyDistributionReceipt;
