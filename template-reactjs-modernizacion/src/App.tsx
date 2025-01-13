import { useContext, useEffect } from "react"
import { HashRouter, Route, Routes, Navigate } from "react-router-dom"
import { UserContext } from "./context/UserWrapper"
import ProtectedRoute from "./utils/ProtectedRoute"
import { ToastContainer } from "react-toastify"

import * as L from "./Layouts"
import * as S from "./screens"

import { initApp } from "./handlers"

const App = () => {
    const { actions, store } = useContext(UserContext)

    useEffect(() => {
        initApp(actions)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const NotFound = () => <div>404 Not Found</div>
    console.log(__DEV__)

    return (
        <HashRouter>
            <Routes>
                <Route element={<L.UserLayout />}>
                    <Route path='/' element={<S.Menu />} />
                    <Route
                        path='/examen'
                        element={
                            <ProtectedRoute>
                                <S.Examen />
                            </ProtectedRoute>
                        }
                    />
                    {/* Otras rutas */}
                    {__DEV__ && (
                        <Route path='/_viewcom' element={<S.DevScreen />} />
                    )}
                    <Route path='*' element={<NotFound />} />
                </Route>
                <Route path='/login' element={<S.Login />} />
                <Route path='/register' element={<S.Register />} />
            </Routes>
            <ToastContainer />
        </HashRouter>
    )
}

export default App
