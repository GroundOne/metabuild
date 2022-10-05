import Link from 'next/link';
import Logo from '../UI/Logo';
import PartPvtSwitch from '../UI/PartPvtSwitch';
import Section from '../UI/Section';

export default function AppHeader() {
    const handleSwitch = (active: string) => {
        console.log('switch to ' + active);
    };

    return (
        <Section>
            <div className="flex items-center justify-between  py-6 md:justify-start md:space-x-10">
                <Logo />

                <PartPvtSwitch handleSwitch={handleSwitch} />

                <div className="items-center justify-end md:flex md:flex-1 lg:w-0">
                    <Link href="/app">
                        <div className="ff-btn-primary">Connect Wallet</div>
                    </Link>
                </div>
            </div>
        </Section>
    );
}
