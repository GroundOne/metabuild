import { yupResolver } from '@hookform/resolvers/yup';
import { JSXElementConstructor, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { env } from '../../constants';
import Button from '../ui-components/Button';
import Input from '../ui-components/Input';

const emailSchema = yup.object({
    email: yup.string().label('Email address').email().required(),
});
type EmailFormValue = yup.InferType<typeof emailSchema>;

const SendCopyToEmail: React.FC<{
    subject: string;
    children: React.ReactElement<any, string | JSXElementConstructor<any>>;
}> = ({ subject, children }) => {
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
                    subject, //'GroundOne: Your part has been issued',
                    message: renderToStaticMarkup(children),
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

    return (
        <>
            {children}

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

export default SendCopyToEmail;
