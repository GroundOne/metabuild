import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
    const isProduction = window?.location?.host === 'app.groundone.io';
    const homepage = 'https://www.groundone.io/demo2022';
    const homeLink = isProduction ? homepage : '/';

    return (
        <div className="flex min-h-full justify-start lg:w-0 lg:flex-1">
            <Link href={homeLink} passHref>
                <Image
                    priority
                    className="h-16 w-auto cursor-pointer"
                    src="/Ground-One-Logo-NEAR.png"
                    alt=""
                    width={200}
                    height={64}
                />
                <span className="sr-only">Ground One</span>
            </Link>
        </div>
    );
}
