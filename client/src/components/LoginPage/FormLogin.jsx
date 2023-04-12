import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'

const login = 'login.svg'

const FormLogin = () => {
    const validationForm = yup.object().shape({
        email: yup.string().required('Email is a required field'),
        password: yup.string().required('Password is a required field'),
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationForm),
    })

    const navigate = useNavigate()

    const axiosInstance = axios.create({
        baseURL: `${process.env.REACT_APP_API_URL}`,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'X-User-Id': localStorage.getItem('userId'),
        },
    })

    const datapost = async (data) => {
        await axiosInstance
            .post(`/auth/login`, data)
            .then((response) => {
                const { token, id } = response.data
                localStorage.setItem('token', token)
                localStorage.setItem('userID', id)
                toast.success('Welcome', {
                    position: toast.POSITION.TOP_CENTER,
                })
                setTimeout(() => navigate('/profile'), 2500)
                setTimeout(() => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('userID')
                }, 3600 * 1000)
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    toast.error('Something went wrong', {
                        position: toast.POSITION.TOP_CENTER,
                    })
                } else if (error.response && error.response.status === 404) {
                    toast.error(`Email doesn't exist`, {
                        position: toast.POSITION.TOP_CENTER,
                    })
                } else {
                    toast.error('Incorrect email or password', {
                        position: toast.POSITION.TOP_CENTER,
                    })
                }
            })
    }

    return (
        <div className="container mx-auto flex h-screen items-center justify-center w-[800px] max-msm:w-[280px]">
            <ToastContainer />
            <div className="bg-white p-16 grid grid-cols-2 place-items-center gap-10 rounded-lg shadow-xl max-md:grid-cols-1">
                <div className="mx-auto max-lg:w-[316px] max-md:hidden">
                    <img src={login} />
                </div>

                <div>
                    <form onSubmit={handleSubmit(datapost)} noValidate>
                        <h1 className="text-center text-5xl pb-10 font-semibold  max-sm:text-4xl">
                            Login In
                        </h1>
                        <div className="mb-6 ">
                            <label
                                for="email"
                                className="block mb-2 text-lg font-semibold "
                            >
                                Email
                            </label>
                            <input
                                name="email"
                                {...register('email')}
                                type="email"
                                placeholder="Email"
                                id="email"
                                className="block px-3 p-2.5 w-full  rounded-lg border border-black  hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-1 hover:scale-105 duration-1000"
                            />
                            <p className=" text-red-500 font-semibold">
                                {errors.email?.message}
                            </p>
                        </div>

                        <div className="mb-6">
                            <label
                                for="password"
                                className="block mb-2 text-lg font-semibold"
                            >
                                Password
                            </label>
                            <input
                                name="password"
                                {...register('password')}
                                type="password"
                                placeholder="Password"
                                id="password"
                                className="block px-3  p-2.5 w-full  rounded-lg border border-black  hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-1 hover:scale-105 duration-1000"
                            />
                            <p className=" text-red-500 font-semibold">
                                {errors.password?.message}
                            </p>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className=" bg-cyan-500 w-full p-4 my-4 font-bold text-white text-xl border border-black rounded-lg hover:scale-105 duration-700"
                            >
                                Login
                            </button>
                            <p>
                                Not registered yet?{' '}
                                <Link to="/signup">
                                    <a className="text-cyan-500 font-semibold">
                                        Create an Account
                                    </a>
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormLogin
