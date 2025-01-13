import React, { useState } from "react"
import Input from "../../components/Input"
import { toastService } from "../../services/toastService"

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState({
        dni: "",
        email: "",
        password: "",
        password_confirmation: "",
        rol: 1,
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: name === "rol" ? Number(value) : value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const dniAsNumber = Number(formData.dni)
        if (isNaN(dniAsNumber)) {
            toastService.error("El DNI debe ser un número válido.")
            return
        }

        if (formData.password !== formData.password_confirmation) {
            toastService.error("Las contraseñas no coinciden.")
            return
        }

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/user-register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...formData,
                        dni: dniAsNumber,
                    }),
                }
            )

            if (response.status === 201) {
                setFormData({
                    dni: "",
                    email: "",
                    password: "",
                    password_confirmation: "",
                    rol: 1,
                })
                window.location.href = "/apps/template/#/login"
            } else {
                toastService.error(
                    "Error al registrar. Revisa los datos e intenta de nuevo."
                )
            }
        } catch (error) {
            console.error("Error al registrar:", error)
        }
    }

    return (
        <div className='flex flex-col justify-center py-[120px] items-center'>
            <div className='flex flex-col bg-white gap-4 p-4 border justify-center border-gray-300 w-[50%] rounded-md'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <h2 className='text-[24px] font-bold'>Registrarse</h2>
                    <div className='flex flex-col'>
                        <Input
                            type='text'
                            name='dni'
                            label='DNI'
                            placeholder='DNI'
                            value={formData.dni}
                            onChange={handleChange}
                            className={{
                                input: "p-2 border border-blue-600 rounded-md flex flex-col w-full",
                            }}
                            required
                        />
                    </div>
                    <Input
                        type='email'
                        name='email'
                        label='Correo Electrónico'
                        placeholder='Correo electrónico'
                        value={formData.email}
                        onChange={handleChange}
                        className={{
                            input: "p-2 border border-gray-400 rounded-md flex flex-col w-full",
                        }}
                        required
                    />
                    <div className='flex flex-col'>
                        <label htmlFor='rol'>Rol</label>
                        <select
                            name='rol'
                            value={formData.rol}
                            onChange={handleChange}
                            className='p-2 border border-gray-400 rounded-md w-full'
                            required
                        >
                            <option value={1}>Usuario Estándar</option>
                            <option value={0}>Usuario Administrador</option>
                        </select>
                    </div>
                    <Input
                        type='password'
                        name='password'
                        label='Contraseña'
                        placeholder='Contraseña'
                        value={formData.password}
                        onChange={handleChange}
                        className={{
                            input: "p-2 border border-gray-400 rounded-md flex flex-col w-full",
                        }}
                        required
                    />
                    <Input
                        type='password'
                        name='password_confirmation'
                        label='Confirmar Contraseña'
                        placeholder='Confirmar contraseña'
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className={{
                            input: "p-2 border border-gray-400 rounded-md flex flex-col w-full",
                        }}
                        required
                    />
                    <button
                        type='submit'
                        className='p-2 bg-blue-500 text-white rounded-md'
                    >
                        Registrarse
                    </button>
                </form>
                <div>
                    <p className=''>
                        Si ya tiene cuenta y quiere ingresar al sistema:
                    </p>
                    <a href='/apps/template/#/login'>
                        <button className='p-2 bg-blue-500 text-white rounded-md w-full'>
                            Iniciar Sesión
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm
