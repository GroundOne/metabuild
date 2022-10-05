import Section from './Section';

export default function AppCard({ children }: { children: React.ReactNode }) {
    return (
        <Section>
            <div className="flex flex-col rounded-3xl mt-14 bg-white shadow-lg max-w-2xl mx-auto text-gray-500">
                <div className='mx-12 my-10'>
                {children}
                </div>
            </div>
        </Section>
    );
}
