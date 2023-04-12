import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'

const signup = 'signup.svg'

const FormSign = () => {
    const validationForm = yup.object().shape({
        name: yup
            .string()
            .required('Name is a required field')
            .max(30, 'Name is only supported up to 30 characters'),
        email: yup
            .string()
            .required('Email is a required field')
            .max(120, 'Email is only supported up to 120 characters'),
        password: yup
            .string()
            .required('Password is a required field')
            .max(30, 'Password is only supported up to 30 characters'),
        confirmpassword: yup
            .string()
            .required('Confirm Password is a required field')
            .max(30, 'Confirm Password is only supported up to 30 characters')
            .oneOf([yup.ref('password'), null], "Passwords don't match"),
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationForm),
    })

    let navigate = useNavigate()

    const datapost = async (data) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, data)
            toast.success('Account created successfully', {
                position: toast.POSITION.TOP_CENTER,
            })
            setTimeout(() => navigate('/login'), 2500)
        } catch (error) {
            if (error.response && error.response.status === 409) {
                const errorMessage = error.response.data.error
                if (errorMessage.includes('name')) {
                    toast.error(
                        'Name already exists, Please choose another Name',
                        {
                            position: toast.POSITION.TOP_CENTER,
                        }
                    )
                } else {
                    toast.error(
                        'Email already exists, please choose another Email',
                        {
                            position: toast.POSITION.TOP_CENTER,
                        }
                    )
                }
            } else {
                toast.error('Something went wrong')
            }
        }
    }

    return (
        <div className="container mx-auto flex h-screen items-center justify-center w-[800px] max-msm:w-[280px]">
            <ToastContainer />
            <div className="bg-white p-10 grid grid-cols-2 place-items-center gap-10 rounded-lg shadow-xl max-md:grid-cols-1">
                <div className="mx-auto w-[400px]  max-lg:w-[380px] max-md:hidden">
                    <img src={signup} />
                </div>

                <div>
                    <form onSubmit={handleSubmit(datapost)} noValidate>
                        <h1 className="text-center text-5xl pb-10 font-semibold  max-sm:text-4xl">
                            Register
                        </h1>

                        <div className="mb-6 ">
                            <label
                                for="name"
                                className="block mb-2 text-lg font-semibold"
                            >
                                Name
                            </label>
                            <input
                                name="name"
                                {...register('name')}
                                type="text"
                                placeholder="Name"
                                id="name"
                                className="block px-3 p-2.5 w-full  rounded-lg border border-black  hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-1 hover:scale-105 duration-1000"
                            />
                            <p className=" text-red-500 font-semibold">
                                {errors.name?.message}
                            </p>
                        </div>

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

                        <div className="mb-6">
                            <label
                                for="confirmpassword"
                                className="block mb-2 text-lg font-semibold"
                            >
                                Confirm Password
                            </label>
                            <input
                                name="confirmpassword"
                                {...register('confirmpassword')}
                                type="password"
                                placeholder="Confirm Password"
                                id="confirmpassword"
                                className="block px-3  p-2.5 w-full  rounded-lg border border-black  hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-1 hover:scale-105 duration-1000"
                            />
                            <p className=" text-red-500 font-semibold">
                                {errors.confirmpassword?.message}
                            </p>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="bg-[#14E229] w-full p-4 my-4 font-bold text-white text-xl border border-black rounded-lg hover:scale-105 duration-700"
                            >
                                Create
                            </button>
                            <p className="">
                                Already have an account?{' '}
                                <Link to="/login">
                                    <a className="text-cyan-500 font-semibold">
                                        Log In
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

export default FormSign
