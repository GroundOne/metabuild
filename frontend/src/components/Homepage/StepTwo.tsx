import Image from 'next/image';
import Section from '../ui-components/Section';

export default function StepTwo() {
    return (
        <Section>
            <div className="flex justify-center pt-10">
                <div className="mb-20 max-w-4xl">
                    <h3 className="my-20 text-2xl font-bold text-black">
                        STEP2: CREATION AND DISTRIBUTION OF REAL ESTATE
                    </h3>
                    <Image
                        className="w-auto"
                        src="/images/how-to-step-2.jpg"
                        alt="How to: Step 2"
                        width={896}
                        height={453}
                    />
                </div>
            </div>
        </Section>
    );
}
