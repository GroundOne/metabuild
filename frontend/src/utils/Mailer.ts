import * as nodemailer from 'nodemailer';
import { env } from '../constants';

type Address = string | { name: string; address: string };

interface MailerConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    defaultSender: Address;
    replyTo?: Address;
}

interface MailerOptions extends Partial<nodemailer.SendMailOptions> {
    from?: Address;
    to: Address | Address[];
    subject?: string;
    message: string;
}

/** Singleton Mailer class */
class MailerInstance {
    private static _instance: MailerInstance;
    private _mailerConfig!: MailerConfig;

    private _transporter!: nodemailer.Transporter;
    // private _checkConfig() {
    //     if (!this._mailerConfig) {
    //         throw new Error('You need to run MailerInstance.init() first');
    //     }
    // }

    // Setting constructor to private prevents creating new instances of the mailer class
    private constructor() {}

    static get Instance(): MailerInstance {
        return this._instance || (this._instance = new this());
    }

    init(config: MailerConfig) {
        if (this._mailerConfig) {
            throw new Error('Mailer is already initialised');
        }
        this._mailerConfig = config;

        this._transporter = nodemailer.createTransport({
            host: this._mailerConfig.host,
            port: this._mailerConfig.port,
            secure: this._mailerConfig.port === 465 ? true : false, // true for 465, false for other ports
            auth: {
                user: this._mailerConfig.user,
                pass: this._mailerConfig.password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        return this;
    }

    /**
     * Send email
     * @param options MailerOptions
     */
    async sendMail(options: MailerOptions): Promise<nodemailer.SentMessageInfo | null> {
        options.from = options.from || this._mailerConfig.defaultSender;
        if (this._mailerConfig.replyTo) options.replyTo = this._mailerConfig.replyTo;
        options.html = options.message;

        return this._transporter.sendMail(options);
    }

    /**
     * Verifies that the configuration is correct and that it can connect to mail server
     */
    async verify(): Promise<true> {
        // verify connection configuration
        return this._transporter.verify();
        // .then((_) => {
        //     return { valid: true };
        // })
        // .catch((error) => {
        //     // logger.error('Email config verification error', error);
        //     return { valid: false, error: error.message };
        // });
    }

    /**
     * Send a test email to the email address specified
     * @param to Email address to receive the message
     */
    async sendTestMail(to: string) {
        await this.sendMail({
            to,
            subject: 'test message',
            message: 'Test message',
        });
    }
}

const Mailer = MailerInstance.Instance;

Mailer.init({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    user: env.EMAIL_USER,
    password: env.EMAIL_PASSWORD,
    defaultSender: env.EMAIL_SENDER_ADDRESS,
});

export default Mailer;
