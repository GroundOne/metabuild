import Link from 'next/link';
import { useState } from 'react';
import { ContractVarsParsed } from '../../utils/near-interface';
import Button from '../ui-components/Button';
import Input from '../ui-components/Input';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { env } from '../../constants';
import { renderToStaticMarkup } from 'react-dom/server';
import { InitialisationVars } from '../../utils/common';

const emailSchema = yup.object({
    email: yup.string().label('Email address').email().required(),
});
type EmailFormValue = yup.InferType<typeof emailSchema>;

const PropertyInitialisationReceipt: React.FC<{
    contractVars?: ContractVarsParsed;
    transactionHashes?: string;
    initialisationVars?: InitialisationVars;
}> = ({ contractVars, transactionHashes, initialisationVars }) => {
    const [emailSent, setEmailSent] = useState<{
        status: 'not_send' | 'send' | 'sending';
        error: boolean;
        message: string;
    }>({ status: 'not_send', error: false, message: '' });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
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
                    subject: 'GroundOne: Property Initialisation Scheme',
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
            <h1 className="text-lg font-semibold">Property Initialisation Scheme Creation Receipt</h1>
            <p className="mt-4">
                Your Property Initialisation scheme for project <b>{contractVars?.projectName}</b> is now live on the
                NEAR blockchain.
            </p>
            <p className="mt-4">
                Your scheme is registered in the PART contract <b>{contractVars?.projectAddress}</b>.
            </p>
            <p className="mt-4">
                There are <b>{initialisationVars?.totalSupply} properties</b> in your scheme numbered from{' '}
                <b>#001 to #{('' + (initialisationVars?.totalSupply ?? '')).padStart(3, '0')}</b>.
            </p>
            <p className="mt-4">
                The following properties will be excluded from the distribution and have been assigned to{' '}
                <b>{contractVars?.ownerId}</b>{' '}
                <b>{contractVars?.reservedProperties?.map((x) => '#' + x.padStart(3, '0')).join(', ')}</b>.
            </p>
            <p className="mt-4">
                Distribution of the properties according to PART Scheme <b>{contractVars?.projectAddress}</b> will take
                place on{' '}
                <b>
                    {initialisationVars?.distributionStartDate.toLocaleString(userLocale, {
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
export default PropertyInitialisationReceipt;
