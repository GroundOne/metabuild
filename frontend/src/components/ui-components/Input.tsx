import React, { forwardRef } from 'react';
import clsx from 'clsx';
// Import ReactTooltip
import ReactTooltip from 'react-tooltip';

interface InputProps extends React.HTMLProps<HTMLInputElement> {
    name: string;
    id: string;
    className?: string;
    isInvalid?: boolean;
    errorText?: string;
    required?: boolean;
    placeholder: string;
    infoText?: string;
    type?: string;
    isDisabled?: boolean;
    labelRight?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            name,
            id,
            isInvalid = false,
            errorText,
            placeholder,
            infoText = '',
            required = false,
            isDisabled = false,
            labelRight = false,
            type = 'text',
            ...otherProps
        },
        ref
    ) => (
        <div className="relative flex flex-col">
            <input
                id={id}
                name={name}
                type={type}
                className={clsx(
                    'mt-10 block w-full rounded-md border-transparent bg-gray-100',
                    'focus:border-gray-300 focus:bg-white focus:ring-0',
                    isInvalid ? 'border-red-600 focus:ring-red-600' : '',
                    isDisabled ? 'bg-gray-200' : '',
                    labelRight ? `pr-[56px]` : '',
                    className
                )}
                disabled={isDisabled}
                //   placeholder={placeholder}
                ref={ref}
                {...otherProps}
            ></input>
            {labelRight && (
                <div className="absolute right-2 mt-10 border-l border-gray-300 py-2 pl-[6px] text-black">
                    {labelRight}
                </div>
            )}
            <label htmlFor={id} className="relative block">
                {isInvalid && errorText && (
                    <span className="-mb-3 block py-1 pl-4 text-left text-sm text-red-600">{errorText}</span>
                )}
                {infoText && (
                    <>
                        <div data-tip={infoText} className="mt-2 inline-block h-4 text-xs text-gray-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                />
                            </svg>
                        </div>
                    </>
                )}
                <span data-tip={infoText} className="mt-2 inline-block pl-4 text-gray-600">
                    {placeholder}
                </span>
                {infoText && <ReactTooltip />}
            </label>
        </div>
    )
);
Input.displayName = 'Input';

export default Input;
