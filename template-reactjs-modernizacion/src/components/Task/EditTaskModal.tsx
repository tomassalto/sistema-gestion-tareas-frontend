import React, { useState, useEffect } from "react"
import Input from "../Input"
import { toastService } from "../../services/toastService.js"

type EditTaskModalProps = {
    task: {
        id: number
        title: string
        description: string
        status: string
        priority: string
        users: { id: number; email: string }[]
        progress_percentage?: number
    }
    onClose: () => void
    onSave: () => void
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
    task,
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        user_ids: task.users.map((user) => user.id),
    })

    const [users, setUsers] = useState<{ id: number; email: string }[]>([])
    const [showConfirmation, setShowConfirmation] = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/api/standard-users",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                )
                if (response.ok) {
                    const data = await response.json()
                    setUsers(data)
                } else {
                    toastService.error("Error al cargar usuarios estándar")
                }
            } catch (error) {
                console.error("Error al cargar usuarios estándar:", error)
            }
        }

        fetchUsers()
    }, [])

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.target
        const checked = (e.target as HTMLInputElement).checked
        if (type === "checkbox") {
            const userId = Number(value)
            setFormData((prev) => ({
                ...prev,
                user_ids: checked
                    ? [...prev.user_ids, userId]
                    : prev.user_ids.filter((id) => id !== userId),
            }))
        } else if (name === "status" && value === "completada") {
            if (formData.status !== "completada") {
                setShowConfirmation(true)
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }))
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    const handleConfirmCompletion = () => {
        setFormData((prev) => ({ ...prev, status: "completada" }))
        setShowConfirmation(false)
    }

    const handleCancelCompletion = () => {
        setFormData((prev) => ({ ...prev, status: task.status }))
        setShowConfirmation(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/tasks/${task.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify(formData),
                }
            )
            if (response.ok) {
                toastService.success("Tarea actualizada con éxito")
                onSave()
                onClose()
            } else {
                toastService.error("Error al actualizar la tarea")
            }
        } catch (error) {
            console.error("Error al actualizar tarea:", error)
        }
    }

    return (
        <div className='modal'>
            <div className='modal-content bg-white shadow-lg rounded p-4'>
                <h3 className='text-3xl text-center font-bold mb-4'>
                    Editar tarea
                </h3>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <Input
                        type='text'
                        name='title'
                        label='Título'
                        value={formData.title}
                        onChange={handleChange}
                        className={{
                            container: "",
                            input: "p-2 border rounded w-full",
                        }}
                        required
                    />
                    <Input
                        type='textarea'
                        name='description'
                        label='Descripción'
                        value={formData.description}
                        onChange={handleChange}
                        className={{
                            container: "",
                            input: "p-2 border rounded w-full",
                        }}
                    />
                    <select
                        name='status'
                        value={formData.status}
                        onChange={handleChange}
                        className='p-2 border rounded'
                    >
                        <option value='pendiente'>Pendiente</option>
                        <option value='en progreso'>En Progreso</option>
                        <option
                            value='completada'
                            disabled={task.progress_percentage !== 100}
                        >
                            Completada
                        </option>
                    </select>
                    <select
                        name='priority'
                        value={formData.priority}
                        onChange={handleChange}
                        className='p-2 border rounded'
                    >
                        <option value='baja'>Baja</option>
                        <option value='media'>Media</option>
                        <option value='alta'>Alta</option>
                    </select>
                    <div className='flex flex-col gap-2'>
                        <p className='font-bold mb-2'>Selecciona usuarios:</p>
                        {users.map((user) => (
                            <label
                                key={user.id}
                                className='flex items-center gap-2'
                            >
                                <Input
                                    type='checkbox'
                                    name='user_ids'
                                    value={user.id.toString()}
                                    checked={formData.user_ids.includes(
                                        user.id
                                    )}
                                    onChange={handleChange}
                                />
                                {user.email}
                            </label>
                        ))}
                    </div>
                    <div className='flex gap-4'>
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
                            Cerrar
                        </button>
                    </div>
                </form>
            </div>
            {showConfirmation && (
                <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 confirmation-modal'>
                    <div className='bg-white rounded-lg shadow-lg p-6 w-[450px]'>
                        <h3 className='text-lg font-bold mb-4'>
                            Confirmar finalización
                        </h3>
                        <p className='mb-6 font-semibold text-lg'>
                            Guardar la tarea en el estado "completada" hará que
                            se finalice y no pueda volverse a editar. ¿Está
                            seguro?
                        </p>
                        <div className='flex justify-start gap-4'>
                            <button
                                onClick={handleConfirmCompletion}
                                className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={handleCancelCompletion}
                                className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditTaskModal
