import React, { useEffect, useState } from "react"
import UserStandardComponent from "../../components/Examen/UserStandardComponent"
import UserAdminComponent from "../../components/Examen/UserAdminComponent"

const Examen: React.FC = () => {
    const [role, setRole] = useState<string | null>(null)

    useEffect(() => {
        const roles = JSON.parse(localStorage.getItem("roles") || "[]")
        if (roles.includes("user_admin")) {
            setRole("user_admin")
        } else if (roles.includes("user_standard")) {
            setRole("user_standard")
        }
    }, [])

    return (
        <div className='flex flex-col justify-center items-center pt-20'>
            <h1 className='text-[40px] text-[#1134c9] z-50 font-semibold'>
                Exámen - Sistema de Gestión de Tareas con Usuarios Múltiples
            </h1>
            <div className='mt-6'>
                {role === "user_standard" && <UserStandardComponent />}
                {role === "user_admin" && <UserAdminComponent />}
                {!role && <p>Cargando...</p>}
            </div>
        </div>
    )
}

export default Examen
