import { useContext } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { toastService } from "../../services/toastService.js"
import { UserContext } from "../../context/UserWrapper"
import { Input } from "../../components"
import { schema } from "./schema"

const Login = () => {
    const { actions: ua, loading } = useContext(UserContext)

    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(schema),
    })

    const login = async (form: any) => {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/user-login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            )

            if (response.ok) {
                const data = await response.json()

                localStorage.setItem("token", data.token)
                localStorage.setItem("roles", JSON.stringify(data.user.roles))

                ua.setStore(data.user)

                window.location.href = "/apps/template/#/examen"
            } else {
                toastService.error("Error al iniciar sesión.")
            }
        } catch (error) {
            console.error("Error durante el login:", error)
        }
    }

    return (
        <div className='container pt-5'>
            <div className='flex flex-col offset-md-3 col-md-6 offset-sm-1 col-sm-10 bg-body rounded p-2 my-auto'>
                <form onSubmit={handleSubmit(login)} className='p-4'>
                    <h3>Ingresar al sistema</h3>
                    <hr />
                    <Input
                        className={{
                            label: "form-label",
                            input: "form-control",
                        }}
                        invalidMsg={formState.errors.email?.message}
                        label={"Correo electrónico *"}
                        register={{ ...register("email") }}
                    />
                    <Input
                        className={{
                            label: "form-label",
                            input: "form-control",
                        }}
                        invalidMsg={formState.errors.password?.message}
                        type='password'
                        label='Contraseña *'
                        register={{ ...register("password") }}
                    />
                    <div className='d-flex justify-content-center mt-3'>
                        <button
                            type='submit'
                            className='btn btn-primary w-100'
                            disabled={loading}
                        >
                            Ingresar
                        </button>
                    </div>
                </form>
                <p className='px-4'>Si aún no tiene cuenta:</p>
                <a
                    href='/apps/template/#/register'
                    className='px-4 mb-4 w-full'
                >
                    <button className='p-2 bg-[#1134C9] text-white rounded-md w-full'>
                        Registrarse
                    </button>
                </a>
            </div>
        </div>
    )
}

export default Login
