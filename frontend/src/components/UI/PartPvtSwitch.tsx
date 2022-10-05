import { useState } from 'react';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function PartPvtSwitch(props: { handleSwitch: (arg0: string) => void }) {
    const [enabled, setEnabled] = useState(false);

    function switchPartPvt() {
        setEnabled(!enabled);
        props.handleSwitch(enabled ? 'PART' : 'PVT');
    }

    return (
        <div className="ml-8 inline-flex items-center justify-center gap-8 whitespace-nowrap rounded-full border border-transparent bg-white px-2 py-2 text-xl text-gray-700 shadow-sm">
            <button
                className={classNames(enabled ? 'bg-gray-100 font-medium' : 'bg-white', 'rounded-full px-5 leading-8 py-1')}
                onClick={switchPartPvt}
            >
                PART
            </button>
            <button
                className={classNames(enabled ? 'bg-white' : 'bg-gray-100 font-medium', 'rounded-full px-5 leading-8 py-1')}
                onClick={switchPartPvt}
            >
                PVT
            </button>
        </div>
    );
}
