import Link from 'next/link';
import Logo from '../ui-components/Logo';
import Section from '../ui-components/Section';

export default function HomepageHeader() {
    return (
        <Section>
            <div className="flex items-center justify-between py-6 md:justify-start md:space-x-10">
                <Logo />

                <div className="items-center justify-end md:flex md:flex-1 lg:w-0">
                    <Link href="/creator">
                        <div className="ff-btn-primary bg-black text-gray-200 hover:text-white">PART Creators App</div>
                    </Link>
                    <Link href="/buyer">
                        <div className="ff-btn-primary ml-4 bg-black text-gray-200 hover:text-white">Buyer App</div>
                    </Link>
                </div>
            </div>
        </Section>
    );
}
