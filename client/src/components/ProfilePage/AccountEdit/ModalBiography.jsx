import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AiOutlineClose } from 'react-icons/ai'

const ModalBiography = ({ id, options, onClose }) => {
    const [biographyValue, setBiographyValue] = useState('')

    const validationForm = yup.object().shape({
        biography: yup
            .string()
            .required('Biography is a required field')
            .max(150, 'Biography is only supported up to 150 characters'),
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationForm),
    })

    const dataput = async (data) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/user/biography/${id}`,
                data,
                options
            )
            toast.success('The biography has been successfully edited', {
                position: toast.POSITION.TOP_CENTER,
            })
            setTimeout(function () {
                window.location.reload(false)
            }, 2500)
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong', {
                position: toast.POSITION.TOP_CENTER,
            })
        }
    }

    useEffect(() => {
        const loadBiography = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/user/${id}`,
                    options
                )
                setBiographyValue(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        loadBiography()
    }, [id])

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-100 flex items-center justify-center">
            <ToastContainer />
            <div className="bg-white rounded-lg p-8">
                <div className="flex justify-end">
                    <button className="" onClick={onClose}>
                        <AiOutlineClose
                            className="hover:scale-125 duration-700"
                            size={36}
                        />
                    </button>
                </div>
                <form
                    onSubmit={handleSubmit(dataput)}
                    noValidate
                    className="p-5 bg-slate-200 rounded-lg my-5 shadow-xl"
                >
                    <div className="mb-6">
                        <label
                            htmlFor="biography"
                            className="block mb-2 text-lg text-center font-semibold"
                        >
                            Biography
                        </label>
                        <textarea
                            {...register('biography')}
                            defaultValue={biographyValue.biography}
                            rows="5"
                            cols="1"
                            name="biography"
                            placeholder="biography"
                            id="biography"
                            className="text-black block px-3   p-2.5 w-full  rounded-lg border border-black hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-1 hover:scale-105 duration-1000"
                            onChange={(e) => setBiographyValue(e.target.value)}
                        />
                        <p className=" text-red-500 font-semibold">
                            {errors.biography?.message}
                        </p>
                    </div>
                    <div className="mt-12">
                        <button
                            type="submit"
                            className="flex mx-auto bg-green-400 px-12 py-3 text-xl  font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 "
                        >
                            Add/Edit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalBiography
