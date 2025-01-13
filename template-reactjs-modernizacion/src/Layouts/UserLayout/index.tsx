import React, { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { toastService } from "../../services/toastService"

const UserLayout: React.FC = () => {
    const [user, setUser] = useState<{ name: string; email: string } | null>(
        null
    )
    const nav = useNavigate()

    const fetchUser = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/user", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data)
            } else {
                setUser(null)
            }
        } catch (error) {
            toastService.error("Error al obtener el usuario:", error)
            setUser(null)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        nav("/login")
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <>
            <nav className='navbar flex justify-between p-2 gap-1 items-center'>
                <img
                    alt='Logo Neuquén Capital'
                    src='https://webservice.muninqn.gov.ar/cglobales/assets/banners/neuquen-2024.svg'
                    className='size-20'
                />

                {user ? (
                    <div className='flex justify-center items-center h-full'>
                        <button
                            className='btn btn-outline-primary dropdown-toggle'
                            type='button'
                            id='userMenu'
                            data-bs-toggle='dropdown'
                            aria-expanded='false'
                        >
                            {user.email}
                        </button>
                        <ul
                            className='dropdown-menu dropdown-menu-end'
                            aria-labelledby='userMenu'
                        >
                            <li>
                                <button
                                    className='dropdown-item'
                                    onClick={handleLogout}
                                >
                                    Cerrar sesión
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className='d-flex gap-2'>
                        <button
                            className='btn btn-primary btn-sm'
                            onClick={() => nav("/login")}
                        >
                            Ingresar
                        </button>
                        <button
                            className='btn btn-outline-primary btn-sm'
                            onClick={() => nav("/register")}
                        >
                            Registrarse
                        </button>
                    </div>
                )}
            </nav>

            <main>
                <Outlet />
            </main>
        </>
    )
}

export default UserLayout
