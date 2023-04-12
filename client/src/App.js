import React, { useState, useEffect } from 'react'
import { TailSpin } from 'react-loader-spinner'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './components/PrivateRouters'
import HomePage from './pages/HomePage'
import PostCategoryPage from './pages/PostCategoryPage'
import AuthorSearchPage from './pages/AuthorSearchPage'
import AuthorPage from './pages/AuthorPage'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'
import SignPage from './pages/SignPage'
import ProfilePage from './pages/ProfilePage'
import PostPage from './pages/PostPage'
import NotFoundPage from './components/NotFoundPage'

function App() {
    const image = 'maintenance.svg'

    const [isLoading, setIsLoading] = useState(true)
    const [serverStatus, setServerStatus] = useState(true)

    async function checkServerStatus() {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}`)
            if (!response.ok) {
                throw new Error('Server response not OK')
            }
        } catch (error) {
            throw new Error('Could not connect to server')
        }
    }

    useEffect(() => {
        setIsLoading(true)
        checkServerStatus()
            .then(() => {
                setIsLoading(false)
                setServerStatus(true)
            })
            .catch(() => {
                setIsLoading(false)
                setServerStatus(false)
            })
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="">
                    <TailSpin
                        height="340"
                        width="200"
                        color="white"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                </div>
            </div>
        )
    }

    if (!serverStatus) {
        return (
            <div class="mx-auto flex items-center justify-center h-screen max-sm:w-[380px] max-msm:w-[280px]">
                <div className="bg-white p-10 shadow-xl rounded-xl">
                    <img
                        src={image}
                        className="w-[500px] max-sm:w-[380px] max-msm:w-[280px]"
                    />
                    <h1 className="text-center text-3xl font-bold pt-10 max-sm:text-2xl">
                        We are under maintenance
                    </h1>
                    <p className="text-center text-xl">
                        Please try again later.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <Router>
            <Routes>
                <Route element={<PrivateRoutes />}>
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>

                <Route path="/" element={<HomePage />} />
                <Route path="/post/:id" element={<PostPage />} />
                <Route path="/author" element={<AuthorSearchPage />} />
                <Route path="/author/:name" element={<AuthorPage />} />
                <Route
                    path="/category/:category"
                    element={<PostCategoryPage />}
                />
                <Route path="/search/:query" element={<SearchPage />} />
                <Route path="/signup" element={<SignPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    )
}

export default App
