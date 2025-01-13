import React from "react"

type ConfirmationModalProps = {
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null

    return (
        <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-[450px]'>
                <h3 className='text-xl font-bold mb-4'>{title}</h3>
                <p className='mb-6 font-semibold text-lg'>{message}</p>
                <div className='flex justify-start gap-4'>
                    <button
                        onClick={onConfirm}
                        className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                    >
                        Confirmar
                    </button>
                    <button
                        onClick={onCancel}
                        className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal
