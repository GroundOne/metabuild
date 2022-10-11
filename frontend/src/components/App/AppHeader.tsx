import Link from 'next/link';
import ConnectWalletButton from '../ui-components/ConnectWalletButton';
import Logo from '../ui-components/Logo';
import PartPvtSwitch from '../ui-components/PartPvtSwitch';
import Section from '../ui-components/Section';

const AppHeader: React.FC<{ connectButtonName: string; redirect: string }> = ({ connectButtonName, redirect }) => {
    const handleSwitch = (active: string) => {
        console.log('switch to ' + active);
    };

    return (
        <Section>
            <div className="flex items-center justify-between  py-6 md:justify-start md:space-x-10">
                <Logo />

                {/* <PartPvtSwitch handleSwitch={handleSwitch} /> */}

                <div className="items-center justify-end md:flex md:flex-1 lg:w-0">
                    <ConnectWalletButton connectButtonName={connectButtonName} onSignInRedirect={redirect} />
                </div>
            </div>
        </Section>
    );
};

export default AppHeader;
