import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { env } from '../../constants';
import { ContractVarsParsed } from '../../utils/near-interface';
import Button from '../ui-components/Button';
import Input from '../ui-components/Input';

const emailSchema = yup.object({
    email: yup.string().label('Email address').email().required(),
});
type EmailFormValue = yup.InferType<typeof emailSchema>;

const BuyPartReceipt: React.FC<{
    contractVars: ContractVarsParsed;
    purchaseOptions: 'participateIRD' | 'buyPart';
    transactionHashes: string;
}> = ({ contractVars, purchaseOptions, transactionHashes }) => {
    const [emailSent, setEmailSent] = useState<{
        status: 'not_send' | 'send' | 'sending';
        error: boolean;
        message: string;
    }>({ status: 'not_send', error: false, message: '' });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EmailFormValue>({ resolver: yupResolver(emailSchema) });

    const userLocale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

    const onSubmit = async (data: EmailFormValue) => {
        try {
            setEmailSent({ status: 'sending', error: false, message: '' });
            const api = env.NEXT_PUBLIC_API_URL + '/send-email';
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: data.email,
                    template: 'transactionalEmail',
                    subject: 'GroundOne: IRD Registration Confirmed',
                    message: renderToStaticMarkup(receiptInfo),
                }),
            });

            const { success, message } = await response.json();
            if (response.status !== 200) {
                setEmailSent({ status: 'not_send', error: true, message: 'Email was not sent! Try again.' });
            } else if (success) {
                setEmailSent({ status: 'send', error: false, message });
            } else {
                setEmailSent({ status: 'not_send', error: true, message });
            }
        } catch (error: any) {
            setEmailSent({ status: 'not_send', error: true, message: error.message });
        }
    };

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
                        The IRD (Initial Random Distribution) will be happening on
                        <b>
                            {contractVars?.saleOpeningDate.toLocaleString(userLocale, {
                                timeZoneName: 'short',
                            })}
                        </b>
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
                        {/* TODO: Fetch the assigned ranking from the newly minted part */}
                        You have been assigned the ranking <b>{contractVars?.currentTokenId}</b>.
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

    return (
        <>
            {receiptInfo}

            {emailSent.status !== 'send' && (
                <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-x-5">
                        <Input
                            id="email"
                            type="text"
                            placeholder="Receive this receipt by email."
                            isDisabled={emailSent.status === 'sending'}
                            isInvalid={!!errors.email}
                            errorText={errors.email?.message as string | undefined}
                            {...register('email')}
                        />
                        <div>
                            <Button
                                isLoading={emailSent.status === 'sending'}
                                type="submit"
                                isInvertedColor
                                size="sm"
                                className="mt-10"
                            >
                                {emailSent.status === 'sending' ? `Sending…` : `Send Email`}
                            </Button>
                        </div>
                    </div>
                </form>
            )}
            {emailSent.status === 'send' && (
                <div className="mt-10">
                    <p className="text-center">
                        <b>The receipt has been sent to your email address</b>
                    </p>
                </div>
            )}
            {emailSent.error && (
                <div className="mt-10">
                    <p className="text-center">
                        <b>{emailSent.message}</b>
                    </p>
                </div>
            )}
        </>
    );
};
export default BuyPartReceipt;
