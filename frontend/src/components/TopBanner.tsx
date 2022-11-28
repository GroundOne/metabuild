import Section from './ui-components/Section';

export default function TopBanner() {
    return (
        <div className="bg-gray-700 py-3 text-slate-100">
            <Section>
                <div className="flex content-center items-center text-center">
                    <div className="flex content-center items-center text-center text-sm ">
                        This app is in test version. All projects are fictional examples. Developers decline all
                        responsibility. Do not buy any tokens for significant amounts or outside of testnet.
                    </div>
                </div>
            </Section>
        </div>
    );
}
