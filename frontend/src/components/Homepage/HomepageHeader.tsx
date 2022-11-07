import Link from 'next/link';
import Button from '../ui-components/Button';
import Logo from '../ui-components/Logo';
import Section from '../ui-components/Section';

export default function HomepageHeader() {
    return (
        <Section>
            <div className="flex items-center justify-between py-6 md:justify-start md:space-x-10">
                <Logo />

                <div className="items-center justify-end md:flex md:flex-1 lg:w-0">
                    <Link href="/part-issuer">
                        <Button as="span" isInvertedColor className="bg-black text-gray-200 hover:text-white">
                            PART Issuers App
                        </Button>
                    </Link>
                    <Link href="/part-holder">
                        <Button as="span" isInvertedColor className="ml-4 bg-black text-gray-200 hover:text-white">
                            Part Holder App
                        </Button>
                    </Link>
                </div>
            </div>
        </Section>
    );
}
