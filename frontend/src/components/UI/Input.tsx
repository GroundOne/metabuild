import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.HTMLProps<HTMLInputElement> {
    name: string;
    id: string;
    className?: string;
    isInvalid?: boolean;
    errorText?: string;
    required?: boolean;
    placeholder: string;
    type?: string;
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
            required = false,
            type = 'text',
            ...otherProps
        },
        ref
    ) => {
        return (
            <label className="block">
                <input
                    id={id}
                    name={name}
                    type={type}
                    className={clsx(
                        'mt-10 ml-[-2px] block w-full rounded-md border-transparent bg-gray-100',
                        'focus:border-gray-300 focus:bg-white focus:ring-0',
                        isInvalid ? 'border-red-600 focus:ring-red-600' : '',
                        className
                    )}
                    //   placeholder={placeholder}
                    ref={ref}
                    {...otherProps}
                ></input>
                <span className="mt-2 inline-block text-gray-600">{placeholder}</span>
                {isInvalid && errorText && (
                    <span className="mt-1 block pl-4 text-left text-sm text-red-600">{errorText}</span>
                )}
            </label>
        );
    }
);
Input.displayName = 'Input';

export default Input;
