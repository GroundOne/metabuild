import { Head, Html, Main, NextScript } from 'next/document';
import TopBanner from '../components/TopBanner';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="utf-8" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
            </Head>
            <body>
                <TopBanner />
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
