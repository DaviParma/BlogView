import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AiOutlineClose } from 'react-icons/ai'

const ModalName = ({ name, id, options, onClose }) => {
    const validationForm = yup.object().shape({
        name: yup
            .string()
            .required('Name is required field')
            .max(30, 'Name is only supported up to 30 characters'),
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
                `${process.env.REACT_APP_API_URL}/user/name/${id}`,
                data,
                options
            )
            toast.success('The name has been successfully edited', {
                position: toast.POSITION.TOP_CENTER,
            })
            setTimeout(function () {
                window.location.reload(false)
            }, 2500)
        } catch (error) {
            console.log(error)
            if (error.response && error.response.status === 409) {
                toast.error('Name already exists, please choose another', {
                    position: toast.POSITION.TOP_CENTER,
                })
            } else {
                toast.error('Something went wrong', {
                    position: toast.POSITION.TOP_CENTER,
                })
            }
        }
    }

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
                            htmlFor="name"
                            className="block mb-2 text-lg text-center font-semibold"
                        >
                            Name
                        </label>
                        <input
                            defaultValue={name}
                            {...register('name')}
                            type="text"
                            placeholder="Name"
                            id="name"
                            className="text-black block px-3 p-2.5 w-full  rounded-lg border border-black  hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-1 hover:scale-105 duration-1000"
                        />
                        <p className=" text-red-500 font-semibold">
                            {errors.name?.message}
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

export default ModalName
