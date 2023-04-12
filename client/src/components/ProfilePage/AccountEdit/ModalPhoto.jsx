import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import FormData from 'form-data'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AiOutlineClose } from 'react-icons/ai'

const ModalPhoto = ({ id, options, onClose }) => {
    const [selectedPhoto, setSelectedPhoto] = useState(null)

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedPhoto(URL.createObjectURL(file))
        }
    }

    const validationForm = yup.object().shape({
        photo: yup
            .mixed()
            .test('name', 'Photo is required', (value) => {
                return value[0] && value[0].name !== ''
            })
            .test('type', 'Photo has to be jpeg, jpg, png or gif', (value) => {
                return value[0] && value[0].type.includes('image')
            }),
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
            const formData = new FormData()
            formData.append('file', data.photo[0])

            await axios.put(
                `${process.env.REACT_APP_API_URL}/user/photo/${id}`,
                formData,
                options,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            toast.success('The photo has been successfully edited', {
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

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-100 flex items-center justify-center ">
            <ToastContainer />

            <div className="bg-white rounded-lg p-8 ">
                <div className="flex justify-end">
                    <button onClick={onClose}>
                        <AiOutlineClose
                            className="hover:scale-125 duration-700"
                            size={36}
                        />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(dataput)}
                    noValidate
                    encType="multipart/form-data"
                    className="p-5 bg-slate-200 rounded-lg my-5 shadow-xl max-msm:w-[280px]"
                >
                    <div className="mb-6">
                        <label
                            htmlFor="photo"
                            className="block mb-2 text-lg text-center font-semibold"
                        >
                            Photo
                        </label>
                        <div className="flex justify-center items-center">
                            <input
                                {...register('photo')}
                                type="file"
                                name="photo"
                                id="photo"
                                onChange={handleFileChange}
                            />
                        </div>
                        <p className=" text-red-500 text-center font-semibold">
                            {errors.photo?.message}
                        </p>
                        {selectedPhoto && (
                            <div className="mt-2 py-5">
                                <h1 className="text-center text-lg font-semibold pb-4">
                                    Photo Selected
                                </h1>
                                <div className="p-1 bg-black shadow-xl">
                                    <img
                                        src={selectedPhoto}
                                        alt="Selected Photo"
                                        className=" w-[450px] h-[253px]"
                                    />
                                </div>
                            </div>
                        )}
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

export default ModalPhoto
