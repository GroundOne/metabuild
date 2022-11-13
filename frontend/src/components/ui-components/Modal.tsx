import React, { forwardRef } from 'react';
import clsx from 'clsx';
import Button from './Button';

interface ModalProps extends React.HTMLProps<HTMLDivElement> {
    show: boolean;
    title: string;
    maxWidth?:
        | 'max-w-md'
        | 'max-w-lg'
        | 'max-w-xl'
        | 'max-w-2xl'
        | 'max-w-3xl'
        | 'max-w-4xl'
        | 'max-w-5xl'
        | 'max-w-6xl'
        | 'max-w-7xl'
        | 'max-w-full'
        | 'max-w-screen-sm'
        | 'max-w-screen-md'
        | 'max-w-screen-lg'
        | 'max-w-screen-xl'
        | 'max-w-screen-2xl';
    children?: React.ReactNode | React.ReactNode[];
    className?: string;
    onClose?: () => void;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
    ({ show, title, maxWidth, children, className, onClose, ...rest }, ref) => {
        if (!show) {
            return null;
        }
        return (
            <div
                ref={ref}
                {...rest}
                tabIndex={-1}
                className={clsx(
                    !show && 'hidden',
                    // 'pointer-events-none',
                    'fixed flex items-center justify-center bg-black bg-opacity-30',
                    'h-modal fixed top-0 right-0 left-0 z-50 w-full overflow-y-auto overflow-x-hidden md:inset-0 md:h-full'
                )}
            >
                <div className="fixed top-0 left-0 h-full w-full" onClick={onClose}></div>
                <div
                    className={clsx(
                        'pointer-events-auto relative mb-[25vh] h-full w-full p-4 md:h-auto',
                        maxWidth ?? 'max-w-screen-sm'
                    )}
                >
                    {/* Modal content */}
                    <div className="relative rounded-lg bg-white shadow ">
                        {/* Modal header */}
                        <div
                            className={clsx('flex items-center justify-between rounded-t p-5', children && 'border-b')}
                        >
                            <h3 className="text-xl font-medium text-gray-900 ">{title}</h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {/* Modal body */}
                        {children && (
                            <div className="space-y-6 p-6">
                                <div className="text-base leading-relaxed text-gray-500">{children}</div>
                            </div>
                        )}
                        {/* Modal footer */}
                        {children && (
                            <div className="flex items-center space-x-2 rounded-b border-t border-gray-200 p-6">
                                <Button isInvertedColor size="sm" onClick={onClose}>
                                    <span>Close</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);
Modal.displayName = 'Modal';

export default Modal;
