import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
    return (
        <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" passHref>
                <Image
                    priority
                    className="h-8 w-auto cursor-pointer sm:h-10"
                    src="/ground-one.svg"
                    alt=""
                    width={200}
                    height={30}
                />
                <span className="sr-only">Ground One</span>
            </Link>
        </div>
    );
}
