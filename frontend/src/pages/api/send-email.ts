import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import Mailer from "../../utils/Mailer";

const emailTemplates = {
    testMail: {
        subject: 'Test Mail',
        message: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
        <html>
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        </head>
        <body>
        <div style="padding:20px;">
        <div style="max-width: 500px;">
        <h2>Test Mail</h2>
        <p>
        Hi there,<br/><br/>
        This is a test mail here.
        </p>
        </div>
        </div>
        </body>
        </html>
        `
    }
}

const sendEmailSchema = yup.object({
    to: yup.string().email().required(),
    template: yup.string().required().oneOf([...Object.keys(emailTemplates)], 'Invalid template'),
});


type ReqBody = yup.InferType<typeof sendEmailSchema>;

export default async function checkUserAPI(request: Omit<NextApiRequest, 'body'> & { body: ReqBody }, response: NextApiResponse) {
    if (request.method === 'POST') {
        try {
            const { to, template } = await sendEmailSchema.validate(request.body, { abortEarly: false });
            const { subject, message } = emailTemplates[template as keyof typeof emailTemplates];
            await Mailer.sendMail({ to, subject, message });
            response.status(200).json({
                success: true,
                message: 'Email sent successfully'
            });
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                response.status(400).json({
                    success: false,
                    message: error.message
                });
            } else {
                response.status(500).json({
                    success: false,
                    message: 'Something went wrong'
                });
            }
        }
    } else {
        response.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }
}
