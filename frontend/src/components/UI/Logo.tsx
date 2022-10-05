import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
    return (
        <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/">
                <Image className="h-8 w-auto sm:h-10 cursor-pointer" src="/ground-one.svg" alt="" width={200} height={30} />
            </Link>
        </div>
    );
}
