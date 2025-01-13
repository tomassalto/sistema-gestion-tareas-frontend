import React, { useState, useEffect } from "react"
import Input from "../Input/index"
import { toastService } from "../../services/toastService"

type TaskFormProps = {
    task?: {
        title: string
        description: string
        status: string
        priority: string
        user_ids: number[]
        progress_percentage?: number
    }
    onSubmit: (formData: {
        title: string
        description: string
        status: string
        priority: string
        user_ids: number[]
    }) => void
    onClose: () => void
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        title: task?.title || "",
        description: task?.description || "",
        status: task?.status || "",
        priority: task?.priority || "",
        user_ids: task?.user_ids || [],
    })

    const [users, setUsers] = useState<{ id: number; email: string }[]>([])

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
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            ...formData,
            user_ids: formData.user_ids,
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className='flex flex-col w-[450px] justify-center gap-2'
        >
            <Input
                label='Título'
                type='text'
                name='title'
                placeholder='Escribe el título'
                value={formData.title}
                onChange={handleChange}
                className={{
                    container: "mb-4",
                    label: "text-sm font-bold",
                    input: "border border-gray-300 p-2 rounded w-full",
                }}
                required
            />
            <Input
                label='Descripción'
                type='textarea'
                name='description'
                placeholder='Escribe la descripción'
                value={formData.description}
                onChange={handleChange}
                className={{
                    container: "mb-4",
                    label: "text-sm font-bold",
                    input: "border border-gray-300 p-2 rounded w-full",
                }}
            />
            <select
                name='status'
                value={formData.status}
                onChange={handleChange}
                className='h-[40px] border-[1px] border-[#1134c9] rounded-lg'
            >
                <option value='' disabled>
                    Selecciona un estado
                </option>
                <option value='pendiente'>Pendiente</option>
                <option value='en progreso'>En Progreso</option>
                <option
                    value='completada'
                    disabled={task?.progress_percentage !== 100}
                >
                    Completada
                </option>
            </select>
            <select
                name='priority'
                value={formData.priority}
                onChange={handleChange}
                className='h-[40px] border-[1px] border-[#1134c9] rounded-lg'
            >
                <option value='' disabled>
                    Selecciona una prioridad
                </option>
                <option value='baja'>Baja</option>
                <option value='media'>Media</option>
                <option value='alta'>Alta</option>
            </select>
            <div>
                <p className='font-bold mb-2'>Selecciona usuarios:</p>
                {users.map((user) => (
                    <label
                        key={user.id}
                        className='flex items-center gap-2 mb-2'
                    >
                        <input
                            type='checkbox'
                            name='user_ids'
                            value={String(user.id)}
                            checked={formData.user_ids.includes(user.id)}
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
    )
}

export default TaskForm
