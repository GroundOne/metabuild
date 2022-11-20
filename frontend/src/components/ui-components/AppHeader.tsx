import ConnectWalletButton from './ConnectWalletButton';
import HeaderMenu from './HeaderMenu';
import Logo from './Logo';
import Section from './Section';

const AppHeader: React.FC<{ buttons?: Array<{ name: string; url: string }>; connectButtonName?: string | null }> = ({
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
