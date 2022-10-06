import Section from '../UI/Section';
import Image from 'next/image';

export default function StepOne() {
    return (
        <Section>
            <div className="flex justify-center">
                <div className="max-w-4xl">
                    <h3 className='text-2xl font-bold text-black my-20'>STEP1: CREATION AND DISTRIBUTION OF PARTs</h3>
                    <Image
                        className="w-auto"
                        src="/images/how-to-step-1.jpg"
                        alt="How to: Step 1"
                        width={896}
                        height={453}
                    />
                </div>
            </div>
        </Section>
    );
}
