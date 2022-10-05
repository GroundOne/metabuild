import Link from 'next/link';
import Logo from '../UI/Logo';
import Section from '../UI/Section';

export default function HomepageHeader() {
    return (
        <Section>
            <div className="flex items-center justify-between  py-6 md:justify-start md:space-x-10">
                <Logo />

                <div className="items-center justify-end md:flex md:flex-1 lg:w-0">
                    <Link href="/app">
                        <div className="ff-btn-primary bg-black  hover:text-white text-gray-200">
                            Launch App
                        </div>
                    </Link>
                </div>
            </div>
        </Section>
    );
}
