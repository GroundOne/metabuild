import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
    const homeLink = window?.location?.host === 'app.groundone.io' ? 'https://www.groundone.io' : '/';

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
