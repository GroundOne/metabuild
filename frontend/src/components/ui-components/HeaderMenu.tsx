import { useState } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Link from 'next/link';

const HeaderMenu: React.FC<{ buttons: Array<{ name: string; url: string }> }> = ({ buttons }) => {
    const router = useRouter();

    return (
        <div className="ml-8 inline-flex items-center justify-center gap-8 whitespace-nowrap rounded-full border border-transparent bg-white px-2 py-2 text-xl text-gray-700 shadow-sm">
            {buttons.map((button, i) => (
                <Link href={button.url} key={button.name}>
                    <div
                        className={clsx(
                            'rounded-full bg-white px-5 py-1 leading-8',
                            router.pathname === button.url && 'bg-gray-100 font-medium'
                        )}
                    >
                        {button.name}
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default HeaderMenu;
