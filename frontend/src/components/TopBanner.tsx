import Section from './ui-components/Section';

export default function TopBanner() {
    return (
        <div className="bg-gray-700 pt-3 pb-4 text-white text-opacity-70">
            <Section>
                <div className="flex">
                    <div className="text-center text-sm font-medium">
                        This app is in test version. All projects are fictional examples. Developers decline all
                        responsibility. Do not buy any tokens for significant amounts or outside of testnet.
                    </div>
                </div>
            </Section>
        </div>
    );
}
