import Section from '../ui-components/Section';
import ConnectWalletButton from '../ui-components/ConnectWalletButton';

const PartHolderHowTo: React.FC = () => {
    return (
        <Section>
            <div className="flex justify-center pb-16">
                <div className="max-w-4xl">
                    <h3 className="mt-20 mb-6 text-2xl font-bold text-white">This is how it works</h3>
                    <p className="py-2 text-lg text-black">
                        First, you will need to create a NEAR wallet and purchase NEAR tokens on an exchange.
                    </p>
                    <p className="py-2 text-lg text-black">
                        After that, you can purchase PART NFTs. For that you will need the contract address of a
                        project. A PART gives you priority access to buy or rent a property once the project is built.
                        Each PART has a ranking number.
                    </p>
                    <p className="py-2 text-lg text-black">
                        PARTs are either randomly distributed at Sale Opening Date if you register before the launch, or
                        you can purchase the highest ranked PART available after Sale Opening Date.
                    </p>
                    <p className="py-2 text-lg text-black">
                        If you already own a PART and your project is being built, go to the MANAGE section of the app
                        in order to select your favourite properties for the Property Distribution.
                    </p>
                    <p className="py-2 text-lg text-black">
                        For more information, please visit{' '}
                        <a
                            className="hoover:text-blue-600 text-blue-800"
                            href="https://documentation.groundone.io/whitepaper/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            https://documentation.groundone.io/whitepaper/
                        </a>
                    </p>
                    <div className="mt-10 flex w-full items-center justify-center">
                        <ConnectWalletButton />
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default PartHolderHowTo;
