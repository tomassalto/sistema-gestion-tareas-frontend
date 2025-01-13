import React from "react"

interface ModalProps {
    show: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    footer?: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({
    show,
    onClose,
    title,
    children,
    footer,
}) => {
    if (!show) return null

    return (
        <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg shadow-lg w-96 p-6'>
                <div className='flex justify-between items-center border-b pb-2'>
                    <h2 className='text-lg font-semibold'>{title}</h2>
                    <button
                        onClick={onClose}
                        className='text-gray-500 hover:text-gray-700'
                    >
                        ✖
                    </button>
                </div>
                <div className='mt-4'>{children}</div>
                {footer && <div className='mt-4 border-t pt-2'>{footer}</div>}
            </div>
        </div>
    )
}

export default Modal
