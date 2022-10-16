import React, { forwardRef } from 'react';

type BaseButtonProps = Omit<React.HTMLProps<HTMLButtonElement>, 'size'>;

interface ButtonProps extends BaseButtonProps {
    children: React.ReactNode;
    isFullWidth?: boolean;
    className?: string;
    variant?: 'solid' | 'outline' | 'ghost';
    isInvertedColor?: boolean;
    size?: 'sm' | 'md' | 'lg';
    as?: string;
    isExternal?: boolean;
    type?: 'button' | 'submit' | 'reset';
    isDisabled?: boolean;
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            as,
            isExternal = false,
            type = 'button',
            variant = 'light',
            size = 'lg',
            isDisabled = false,
            isInvertedColor = false,
            isFullWidth = false,
            isLoading = false,
            className,
            children,
            ...rest
        },
        ref
    ) => {
        const classNameList: string[] = [
            'cursor-pointer',
            'whitespace-nowrap',
            'rounded-full',
            'border',
            'border-transparent',
            'shadow-sm',
            'hover:bg-opacity-90',
            'capitalize',
            // "focus:outline-none",
            // "focus:ring-2",
            // "focus:ring-indigo-400",
            // "focus:ring-offset-2",
            // "focus:ring-offset-indigo-50",
            'font-semibold',
            'rounded-full',
            'inline-flex',
            'flex-shrink-0',
            'items-center',
            'justify-center',
            'transition-colors',
            'ease-in-out',
            'duration-500',
        ];

        if (isFullWidth) classNameList.push('w-full');

        if (isInvertedColor) {
            classNameList.push('bg-[#C3CED8]', 'text-white', 'hover:text-white');
        } else {
            classNameList.push('bg-white', 'text-gray-700', 'hover:text-black');
        }

        // handle variants
        const btnSolid = ['bg-indigo-600', 'hover:bg-indigo-700', 'text-white'];
        const btnOutline = [
            'dark:text-white',
            'hover:text-indigo-700',
            'hover:dark:text-indigo-700',
            'bg-transparent',
            'hover:bg-indigo-50',
            'border',
            'border-indigo-600',
        ];
        const btnGhost = [
            'bg-transparent',
            'dark:text-white',
            'hover:bg-indigo-50',
            'hover:text-indigo-700',
            'hover:dark:text-indigo-700',
        ];

        if (variant === 'solid') {
            classNameList.push(...btnSolid);
        } else if (variant === 'outline') {
            classNameList.push(...btnOutline);
        } else if (variant === 'ghost') {
            classNameList.push(...btnGhost);
        }

        // handle size
        if (size === 'sm') {
            classNameList.push('h-8', 'px-2', 'text-sm');
        } else if (size === 'md') {
            classNameList.push('h-10', 'px-3');
        } else if (size === 'lg') {
            classNameList.push('px-12', 'py-4', 'text-xl');
            // classNameList.push("h-12", "px-4", "text-lg");
        }

        if (isDisabled || isLoading) {
            classNameList.push('disabled', 'opacity-50', 'cursor-not-allowed');
        }

        const classes = classNameList.join(' ');

        const Loading: React.FC = () => {
            return (
                <div role="status" className="inline-flex cursor-not-allowed rounded-md pr-4">
                    <svg
                        className="h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            );
        };

        const Element = as ? (
            React.createElement(
                as,
                {
                    className: `${classes} ${className}`,
                    target: isExternal ? '_blank' : undefined,
                    rel: isExternal ? 'noopener noreferrer' : undefined,
                    ref,
                    ...rest,
                },
                children
            )
        ) : (
            <button {...rest} className={`${classes} ${className}`} ref={ref} disabled={isDisabled}>
                {isLoading && <Loading />}
                {children}
            </button>
        );

        return Element;
    }
);
Button.displayName = 'Button';

export default Button;
