import React, { useState, useEffect } from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import TaskForm from "../Task/index"
import EditTaskModal from "../Task/EditTaskModal"
import "../Task/modal.css"
import { capitalizeFirst } from "../../utils/common"
import SelectSearch from "../SelectSearch/index"
import ConfirmationModal from "../ModalConfirm/ModalConfirm.tsx"
import { toastService } from "../../services/toastService.js"

const UserAdminComponent: React.FC = () => {
    const [tasks, setTasks] = useState([])
    const [filteredTasks, setFilteredTasks] = useState([])
    const [showTaskFormModal, setShowTaskFormModal] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showProgressModal, setShowProgressModal] = useState(false)
    const [selectedTask, setSelectedTask] = useState<any>(null)
    const [progressDetails, setProgressDetails] = useState<{
        completed: any[]
        notCompleted: any[]
    }>({ completed: [], notCompleted: [] })

    const [selectedPriority, setSelectedPriority] = useState<string | null>(
        null
    )
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [taskToDelete, setTaskToDelete] = useState<{
        id: number
        title: string
    } | null>(null)

    useEffect(() => {
        fetchTasks()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [tasks, selectedPriority, selectedStatus])

    const fetchTasks = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/tasks", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            if (response.ok) {
                const data = await response.json()
                setTasks(data)
                setFilteredTasks(data)
            } else {
                toastService.error("Error al cargar tareas")
            }
        } catch (error) {
            toastService.error("Ocurrió un error al cargar tareas")
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
    const handleTaskSubmit = async (formData: any) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            })
            if (response.ok) {
                toastService.success("Tarea creada con éxito")
                fetchTasks()
                setShowTaskFormModal(false)
            } else {
                toastService.error("Error al crear la tarea")
            }
        } catch (error) {
            console.error("Error al crear tarea:", error)
        }
    }

    const handleDeleteTask = async () => {
        if (!taskToDelete) return

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/tasks/${taskToDelete.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            if (response.ok) {
                toastService.success("Tarea eliminada con éxito")
                fetchTasks()
            } else {
                toastService.error("Error al eliminar la tarea")
            }
        } catch (error) {
            console.error("Error al eliminar tarea:", error)
            toastService.error("Ocurrió un error al eliminar la tarea")
        } finally {
            setShowConfirmationModal(false)
            setTaskToDelete(null)
        }
    }

    const handleEditClick = (task: any) => {
        setSelectedTask(task)
        setShowModal(true)
    }

    const handleProgressClick = (task: any) => {
        const completed = task.users.filter((user: any) => user.is_completed)
        const notCompleted = task.users.filter(
            (user: any) => !user.is_completed
        )

        setProgressDetails({ completed, notCompleted })
        setSelectedTask(task)
        setShowProgressModal(true)
    }

    const closeProgressModal = () => {
        setShowProgressModal(false)
    }

    const closeEditModal = () => {
        setShowModal(false)
        setSelectedTask(null)
    }

    const openDeleteConfirmation = (task: { id: number; title: string }) => {
        setTaskToDelete(task)
        setShowConfirmationModal(true)
    }

    const closeDeleteConfirmation = () => {
        setTaskToDelete(null)
        setShowConfirmationModal(false)
    }

    return (
        <div className='p-4'>
            <div className='flex items-center justify-center mb-4'>
                <button
                    onClick={() => setShowTaskFormModal(true)}
                    className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                >
                    Crear nueva tarea
                </button>
            </div>
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
            <div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
                {filteredTasks.map((task: any) => (
                    <div
                        key={task.id}
                        className={`flex flex-col rounded-lg w-[400px] justify-between p-4 border ${
                            task.status === "completada"
                                ? "bg-green-200 hover:bg-green-300"
                                : "bg-white border-gray-200"
                        }`}
                    >
                        <h4 className='text-3xl text-center font-semibold mb-2'>
                            {task.title}
                        </h4>
                        <div>
                            <p className='text-base text-gray-600 mb-2'>
                                {task.description || "Sin descripción"}
                            </p>
                            <p className='text-base mb-2'>
                                <strong>Estado:</strong>{" "}
                                {capitalizeFirst(task.status)}
                            </p>
                            <p className='text-base mb-2'>
                                <strong>Prioridad:</strong>{" "}
                                {capitalizeFirst(task.priority)}
                            </p>
                            <div className='mb-2'>
                                <strong>Progreso:</strong>
                                <div className='w-16 h-16 mt-2'>
                                    <CircularProgressbar
                                        value={task.progress_percentage}
                                        text={`${Math.round(
                                            task.progress_percentage
                                        )}%`}
                                        styles={buildStyles({
                                            pathColor: `#4caf50`,
                                            textColor: "#000",
                                            trailColor: "#d6d6d6",
                                        })}
                                    />
                                </div>
                            </div>
                            <p className='text-base mb-4'>
                                <strong>Usuarios asignados:</strong>
                                {task.users && task.users.length > 0 ? (
                                    <ul className='list-disc list-inside mt-2'>
                                        {task.users.map((user: any) => (
                                            <li
                                                key={user.id}
                                                className={`text-gray-700`}
                                            >
                                                {user.email}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className='text-gray-500'>
                                        No hay usuarios asignados
                                    </p>
                                )}
                            </p>
                        </div>
                        <div className='flex justify-between'>
                            <button
                                onClick={() => handleProgressClick(task)}
                                className='bg-green-500 h-full text-white px-3 py-2 rounded hover:bg-green-600'
                            >
                                Ver progreso
                            </button>
                            <button
                                onClick={() => handleEditClick(task)}
                                className={` text-white px-3 py-2 rounded  ${
                                    task.status === "completada"
                                        ? "bg-gray-500 hover:bg-gray-600 cursor-not-allowed"
                                        : "bg-blue-500 hover:bg-blue-600"
                                }`}
                                disabled={task.status === "completada"}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => openDeleteConfirmation(task)}
                                className='bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600'
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showProgressModal && (
                <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50'>
                    <div className='bg-white rounded-lg shadow-lg p-6 w-[500px] flex flex-col'>
                        <h3 className='text-3xl text-center font-bold mb-4'>
                            Progreso de la tarea
                        </h3>
                        <p className='text-gray-700 mb-4'>
                            <strong>Estado de la tarea:</strong>{" "}
                            {capitalizeFirst(selectedTask?.status) ||
                                "Desconocido"}
                        </p>
                        <div>
                            {progressDetails.completed.length === 0 &&
                            progressDetails.notCompleted.length === 0 ? (
                                <p className='text-center text-gray-500'>
                                    No hay usuarios asignados a esta tarea.
                                </p>
                            ) : (
                                <>
                                    {progressDetails.completed.length > 0 && (
                                        <div>
                                            <h4 className='font-bold text-xl text-green-500'>
                                                Usuario/s que completaron su
                                                parte:
                                            </h4>
                                            <ul>
                                                {progressDetails.completed.map(
                                                    (user: any) => (
                                                        <li key={user.id}>
                                                            {user.email}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                    {progressDetails.notCompleted.length >
                                        0 && (
                                        <div className='mt-4'>
                                            <h4 className='font-bold text-xl text-red-500'>
                                                Usuario/s que no completaron su
                                                parte:
                                            </h4>
                                            <ul>
                                                {progressDetails.notCompleted.map(
                                                    (user: any) => (
                                                        <li key={user.id}>
                                                            {user.email}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <button
                            onClick={closeProgressModal}
                            className='mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {showTaskFormModal && (
                <div className='modal fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50'>
                    <div className='bg-white rounded-lg p-6 shadow-lg'>
                        <h3 className='text-3xl text-center font-bold mb-4'>
                            Crear nueva tarea
                        </h3>
                        <TaskForm
                            onSubmit={handleTaskSubmit}
                            onClose={() => setShowTaskFormModal(false)}
                            task={{
                                ...selectedTask,
                                progress_percentage:
                                    selectedTask?.progress_percentage || 0,
                            }}
                        />
                    </div>
                </div>
            )}

            {showModal && selectedTask && (
                <div className='modal fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50'>
                    <div className='bg-white rounded-lg p-6 shadow-lg'>
                        <EditTaskModal
                            task={selectedTask}
                            onClose={closeEditModal}
                            onSave={fetchTasks}
                        />
                    </div>
                </div>
            )}
            <ConfirmationModal
                isOpen={showConfirmationModal}
                title='Confirmar eliminación'
                message='¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.'
                onConfirm={handleDeleteTask}
                onCancel={closeDeleteConfirmation}
            />
        </div>
    )
}

export default UserAdminComponent
