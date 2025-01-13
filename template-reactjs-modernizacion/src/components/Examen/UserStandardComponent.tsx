import React, { useEffect, useState } from "react"
import { capitalizeFirst } from "../../utils/common"
import EditUserTaskModal from "../../components/Task/EditUserTaskModal"
import SelectSearch from "../SelectSearch/index"
import { toastService } from "../../services/toastService.js"

type Task = {
    id: number
    title: string
    description: string
    status: string
    priority: string
    is_completed: boolean
    assigned_users: { id: number; email: string }[]
}

const UserStandardComponent: React.FC = () => {
    const [tasks, setTasks] = useState<
        {
            id: number
            title: string
            description: string
            status: string
            priority: string
            is_completed: boolean
            assigned_users: { id: number; email: string }[]
        }[]
    >([])
    const [selectedTask, setSelectedTask] = useState<{
        id: number
        title: string
        description: string
    } | null>(null)
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
    const [selectedPriority, setSelectedPriority] = useState<string | null>(
        null
    )
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

    useEffect(() => {
        applyFilters()
    }, [tasks, selectedPriority, selectedStatus])

    useEffect(() => {
        fetchAssignedTasks()
    }, [])

    const fetchAssignedTasks = async () => {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/assigned-tasks",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )

            if (response.ok) {
                const data = await response.json()
                setTasks(data)
                setFilteredTasks(data)
            } else {
                toastService.error("Error al cargar tareas asignadas")
            }
        } catch (error) {
            console.error("Error al cargar las tareas asignadas:", error)
        }
    }

    const applyFilters = () => {
        let filtered = [...tasks]
        if (selectedPriority) {
            filtered = filtered.filter(
                (task: any) => task.priority === selectedPriority
            )
        }
        if (selectedStatus) {
            filtered = filtered.filter(
                (task: any) => task.status === selectedStatus
            )
        }
        setFilteredTasks(filtered)
    }

    const priorityOptions = [
        { value: "baja", label: "Baja" },
        { value: "media", label: "Media" },
        { value: "alta", label: "Alta" },
    ]

    const statusOptions = [
        { value: "pendiente", label: "Pendiente" },
        { value: "en progreso", label: "En Progreso" },
        { value: "completada", label: "Completada" },
    ]

    const handleCompleteTask = async (taskId: number, isCompleted: boolean) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/tasks/${taskId}/progress`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({ is_completed: isCompleted }),
                }
            )

            if (response.ok) {
                if (isCompleted) {
                    toastService.success("Progreso marcado como completado.")
                } else {
                    toastService.success("Progreso marcado como no completado.")
                }
                fetchAssignedTasks()
            } else {
                toastService.error("Progreso marcado como no completado.")
            }
        } catch (error) {
            console.error("Error al actualizar el progreso:", error)
        }
    }

    const handleEditClick = (task: {
        id: number
        title: string
        description: string
    }) => {
        setSelectedTask(task)
    }

    const handleSaveTask = async (updatedTask: {
        id: number
        title: string
        description: string
    }) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/tasks/${updatedTask.id}/edit-basic`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify(updatedTask),
                }
            )

            if (response.ok) {
                toastService.success("Tarea actualizada con éxito.")
                fetchAssignedTasks()
            } else {
                toastService.error("Error al actualizar la tarea.")
            }
        } catch (error) {
            console.error("Error al actualizar la tarea:", error)
        } finally {
            setSelectedTask(null)
        }
    }

    const renderButton = (task: {
        id: number
        is_completed: boolean
        status: string
    }) => {
        if (task.is_completed && task.status !== "completada") {
            return (
                <button
                    onClick={() => handleCompleteTask(task.id, false)}
                    className='bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600'
                >
                    Marcar como no completada
                </button>
            )
        }
        if (!task.is_completed) {
            return (
                <button
                    onClick={() => handleCompleteTask(task.id, true)}
                    className='bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600'
                >
                    Marcar como completada
                </button>
            )
        }
        return null
    }

    return (
        <div className='p-4 flex flex-col gap-4'>
            <h1 className='text-5xl font-bold text-center'>Mis tareas</h1>
            <div className='flex gap-4 justify-center font-bold mb-4'>
                <SelectSearch
                    id='priorityFilter'
                    label='Filtrar por prioridad'
                    options={priorityOptions}
                    value={priorityOptions.find(
                        (opt) => opt.value === selectedPriority
                    )}
                    onChange={(option) =>
                        setSelectedPriority(option ? option.value : null)
                    }
                    isClearable={true}
                    className={{
                        container: "w-56",
                    }}
                />
                <SelectSearch
                    id='statusFilter'
                    label='Filtrar por estado'
                    options={statusOptions}
                    value={statusOptions.find(
                        (opt) => opt.value === selectedStatus
                    )}
                    onChange={(option) =>
                        setSelectedStatus(option ? option.value : null)
                    }
                    isClearable={true}
                    className={{
                        container: "w-56",
                    }}
                />
            </div>
            {filteredTasks.length === 0 ? (
                <div className='text-center text-red-600 text-4xl font-bold bg-white p-2'>
                    Aún no tienes tareas asignadas.
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filteredTasks.map((task: any) => (
                        <div
                            key={task.id}
                            className={`flex flex-col rounded-lg p-4 border justify-between ${
                                task.status === "completada"
                                    ? "bg-green-200 hover:bg-green-300"
                                    : "bg-white border-gray-200"
                            }`}
                        >
                            <h4 className='text-3xl text-center font-semibold mb-2'>
                                {task.title}
                            </h4>
                            <div>
                                <p className='text-sm text-gray-600 mb-2'>
                                    {capitalizeFirst(task.description) ||
                                        "Sin descripción"}
                                </p>
                                <p className='text-sm mb-2'>
                                    <strong>Estado:</strong>{" "}
                                    {capitalizeFirst(task.status)}
                                </p>
                                <p className='text-sm mb-2'>
                                    <strong>Prioridad:</strong>{" "}
                                    {capitalizeFirst(task.priority)}
                                </p>
                                <p className='text-sm mb-4'>
                                    <strong>
                                        Otros usuarios asignados a la tarea:
                                    </strong>
                                    {task.assigned_users.length > 0 ? (
                                        <ul className='list-disc list-inside mt-2'>
                                            {task.assigned_users.map(
                                                (user: {
                                                    id: number
                                                    email: string
                                                }) => (
                                                    <li key={user.id}>
                                                        {user.email}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        <p className='text-gray-500'>
                                            No hay otros usuarios asignados.
                                        </p>
                                    )}
                                </p>
                            </div>
                            <div className='flex gap-2'>
                                {renderButton(task)}
                                <button
                                    onClick={() => handleEditClick(task)}
                                    className={` text-white px-4 py-2 rounded ${
                                        task.status === "completada"
                                            ? "bg-gray-500 hover:bg-gray-600 cursor-not-allowed"
                                            : "bg-blue-500 hover:bg-blue-600"
                                    }`}
                                    disabled={
                                        task.status.toLowerCase().trim() ===
                                        "completada"
                                    }
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selectedTask && (
                <EditUserTaskModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onSave={handleSaveTask}
                />
            )}
        </div>
    )
}

export default UserStandardComponent
