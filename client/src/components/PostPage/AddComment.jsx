import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const AddComment = ({ iduser, idpost }) => {
    const token = localStorage.getItem('token')

    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const validationForm = yup.object().shape({
        text: yup
            .string()
            .required('Text is a required field')
            .max(3000, 'Text is only supported up to 3000 characters'),
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
            await axios.post(
                `${process.env.REACT_APP_API_URL}/posts/comment`,
                data,
                options
            )
            toast.success('Comment successfully created', {
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
        <div className="container mx-auto max-w-lg">
            <ToastContainer />
            <div className="rounded-lg p-8 ">
                <form
                    onSubmit={handleSubmit(dataput)}
                    noValidate
                    className="p-4 bg-slate-200 rounded-lg my-5 shadow-xl"
                >
                    <input
                        {...register('post_id')}
                        type="hidden"
                        name="post_id"
                        value={idpost}
                    />
                    <input
                        {...register('user_id')}
                        type="hidden"
                        name="user_id"
                        value={iduser}
                    />
                    <div className="mb-6">
                        <textarea
                            {...register('text')}
                            rows="5"
                            cols="1"
                            name="text"
                            placeholder="Write something..."
                            id="text"
                            className="text-black block px-3   p-2.5 w-full  rounded-lg border border-black hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                        />
                        <p className=" text-red-500 font-semibold">
                            {errors.text?.message}
                        </p>
                    </div>
                    <div className="mt-12">
                        <button
                            type="submit"
                            className="flex mx-auto bg-green-400 px-12 py-3 text-xl  font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 max-sm:px-2"
                        >
                            Create a comment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddComment
