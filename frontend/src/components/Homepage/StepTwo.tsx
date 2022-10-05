import Section from '../UI/Section';
import Image from 'next/image';

export default function StepTwo() {
    return (
        <Section>
            <div className="pt-10 flex justify-center">
                <div className="max-w-4xl mb-20">
                    <h3 className='text-2xl font-bold text-black my-20'>STEP2: CREATION AND DISTRIBUTION OF REAL ESTATE</h3>
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
