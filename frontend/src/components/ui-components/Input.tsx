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
            required = false,
            isDisabled = false,
            labelRight = false,
            type = 'text',
            ...otherProps
        },
        ref
    ) => {
        return (
            //     <div className="flex flex-col">
            //         <label htmlFor={id} className="text-sm font-semibold">
            //             {placeholder}
            //             {required && <span className="text-red-500">*</span>}
            //         </label>
            //         <input
            //             ref={ref}
            //             id={id}
            //             name={name}
            //             type={type}
            //             disabled={isDisabled}
            //             placeholder={placeholder}
            //             className={clsx(
            //                 'border border-gray-300 rounded-md px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            //                 {
            //                     'border-red-500': isInvalid,
            //                 },
            //                 className
            //             )}
            //             {...otherProps}
            //         />
            //         {isInvalid && <p className="text-red-500 text-sm">{errorText}</p>}
            //     </div>
            // );
            <div className="flex flex-col">
                <input
                    id={id}
                    name={name}
                    type={type}
                    className={clsx(
                        'mt-10 block w-full rounded-md border-transparent bg-gray-100',
                        'focus:border-gray-300 focus:bg-white focus:ring-0',
                        isInvalid ? 'border-red-600 focus:ring-red-600' : '',
                        isDisabled ? 'bg-gray-200' : '',
                        labelRight ? `pr-10 after:content-[${labelRight}] absolute top-0` : '',
                        className
                    )}
                    disabled={isDisabled}
                    //   placeholder={placeholder}
                    ref={ref}
                    {...otherProps}
                ></input>
                <label htmlFor={id} className="relative block">
                    {isInvalid && errorText && (
                        <span className="-mb-3 block py-1 pl-4 text-left text-sm text-red-600">{errorText}</span>
                    )}
                    <span className="mt-2 inline-block pl-4 text-gray-600">{placeholder}</span>
                </label>
            </div>
        );
    }
);
Input.displayName = 'Input';

export default Input;
