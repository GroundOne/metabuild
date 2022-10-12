import Link from 'next/link';
import ConnectWalletButton from '../ui-components/ConnectWalletButton';
import Logo from '../ui-components/Logo';
import HeaderMenu from '../ui-components/HeaderMenu';
import Section from '../ui-components/Section';

const AppHeader: React.FC<{ buttons?: Array<{ name: string; url: string }>; connectButtonName?: string }> = ({
    buttons,
    connectButtonName,
}) => {
    return (
        <Section>
            <div className="flex items-center justify-between  py-6 md:justify-start md:space-x-10">
                <Logo />
                {buttons && <HeaderMenu buttons={buttons} />}

                <div className="items-center justify-end md:flex md:flex-1 lg:w-0">
                    <ConnectWalletButton buttonName={connectButtonName} />
                </div>
            </div>
        </Section>
    );
};

export default AppHeader;
