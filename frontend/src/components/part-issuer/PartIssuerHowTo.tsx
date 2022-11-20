import ConnectWalletButton from '../ui-components/ConnectWalletButton';
import Section from '../ui-components/Section';

const PartIssuerHowTo: React.FC = () => {
    return (
        <Section>
            <div className="flex justify-center pb-16">
                <div className="max-w-4xl">
                    <h3 className="mt-20 mb-6 text-2xl font-bold text-white">How to issue PARTs?</h3>
                    <p className="py-2 text-lg text-black">As an architect or developer you can create PARTs.</p>
                    <p className="py-2 text-lg text-black">
                        A PART is an NFT on the blockchain that gives its owner a priority ranking in purchasing or
                        renting a property once the project is realised.
                    </p>
                    <p className="py-2 text-lg text-black">
                        First you will need to create a PART scheme and sell the PARTs of your project to your
                        community.
                    </p>
                    <p className="py-2 text-lg text-black">
                        Once the properties in your project are ready to be sold or rented, you will need to register
                        them on the blockchain.
                    </p>
                    <p className="py-2 text-lg text-black">
                        PART owners can then choose their favourite properties and finally, the properties are
                        distributed to PART owners according to their preferences.
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
                        <ConnectWalletButton buttonName="Connect Wallet" />
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default PartIssuerHowTo;
