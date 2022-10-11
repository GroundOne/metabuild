import Link from 'next/link';
import ConnectWalletButton from '../ui-components/ConnectWalletButton';
import Section from '../ui-components/Section';

export default function BuyerHowTo() {
    return (
        <Section>
            <div className="flex justify-center pb-16">
                <div className="max-w-4xl">
                    <h3 className="mt-20 mb-6 text-2xl font-bold text-white">This is how it works</h3>
                    <p className="py-2 text-lg text-black">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam dignissimos, debitis fuga
                        mollitia rerum quae illum, beatae fugit quibusdam quam et ipsam deserunt ex consectetur nulla
                        autem maxime officiis sed?
                    </p>
                    <p className="py-2 text-lg text-black">
                        Molestias qui architecto voluptatibus rem, alias ex? Vel nemo explicabo quam itaque eveniet
                        facere alias natus similique eius et recusandae, vero, nisi doloribus magnam dolores, odio saepe
                        cupiditate? Ipsam, recusandae.
                    </p>
                    <p className="py-2 text-lg text-black">
                        Eos omnis deleniti voluptatum tempore adipisci nemo pariatur dolore beatae dolorem vero quisquam
                        voluptas, quo minus itaque eveniet repellat harum amet optio sunt! Veniam aspernatur dolor
                        laborum, delectus necessitatibus ut.
                    </p>
                    <p className="py-2 text-lg text-black">
                        Nemo ducimus, delectus dignissimos quis ipsa perspiciatis ipsam eveniet porro facilis, aliquam,
                        sapiente at id repellendus deserunt neque possimus atque! Iusto similique, dignissimos culpa
                        cupiditate sit necessitatibus ut praesentium labore.
                    </p>
                    <div className="mt-10 flex w-full items-center justify-center">
                        <ConnectWalletButton connectButtonName="Connect Wallet" onSignInRedirect="/App" />
                    </div>
                </div>
            </div>
        </Section>
    );
}
