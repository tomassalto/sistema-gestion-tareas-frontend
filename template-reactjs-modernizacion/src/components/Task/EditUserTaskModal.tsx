import React, { useState } from "react"
import Input from "../Input"

type EditUserTaskModalProps = {
    task: {
        id: number
        title: string
        description: string
    }
    onClose: () => void
    onSave: (updatedTask: {
        id: number
        title: string
        description: string
    }) => void
}

const EditUserTaskModal: React.FC<EditUserTaskModalProps> = ({
    task,
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description,
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            id: task.id,
            title: formData.title,
            description: formData.description,
        })
    }

    return (
        <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-[400px]'>
                <h3 className='text-2xl font-bold mb-4'>Editar tarea</h3>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <Input
                        type='text'
                        name='title'
                        value={formData.title}
                        onChange={handleChange}
                        placeholder='Título'
                        label='Título'
                        className={{
                            container: "w-full",
                            input: "border rounded p-2 w-full",
                        }}
                        required
                    />
                    <Input
                        type='textarea'
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                        placeholder='Descripción'
                        label='Descripción'
                        className={{
                            container: "w-full",
                            input: "border rounded p-2 w-full",
                        }}
                    />
                    <div className='flex justify-start gap-4'>
                        <button
                            type='submit'
                            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                        >
                            Guardar
                        </button>
                        <button
                            type='button'
                            onClick={onClose}
                            className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditUserTaskModal
