import React, { forwardRef } from 'react';
import clsx from 'clsx';
import Button from './Button';

interface ModalProps extends React.HTMLProps<HTMLDivElement> {
    show: boolean;
    title: string;
    children: React.ReactNode | React.ReactNode[];
    className?: string;
    onClose?: () => void;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(({ show, title, children, className, onClose, ...rest }, ref) => {
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
                'pointer-events-none',
                'fixed flex items-center justify-center bg-black bg-opacity-30',
                'h-modal fixed top-0 right-0 left-0 z-50 w-full overflow-y-auto overflow-x-hidden md:inset-0 md:h-full'
            )}
        >
            <div className="pointer-events-auto relative h-full w-full max-w-md p-4 md:h-auto">
                {/* Modal content */}
                <div className="relative rounded-lg bg-white shadow ">
                    {/* Modal header */}
                    <div className="flex items-center justify-between rounded-t border-b p-5">
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
                    <div className="space-y-6 p-6">
                        <div className="text-base leading-relaxed text-gray-500">{children}</div>
                    </div>
                    {/* Modal footer */}
                    <div className="flex items-center space-x-2 rounded-b border-t border-gray-200 p-6">
                        <Button isInvertedColor size="sm" onClick={onClose}>
                            <span>Close</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});
Modal.displayName = 'Modal';

export default Modal;
