import React, { useEffect, useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import FormData from 'form-data'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AiOutlineClose } from 'react-icons/ai'
import categories from '../../json/categories.json'

const ModalEdit = ({ idposts, options, onClose }) => {
    const [value, setValue] = useState('')
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingPost, setLoadingPost] = useState(true)
    const [selectedPhoto, setSelectedPhoto] = useState(null)

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedPhoto(URL.createObjectURL(file))
        }
    }

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'video'],
            [{ align: [] }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ direction: 'rtl' }, { direction: 'ltr' }],
            ['code-block', 'formula', 'clean'],
        ],
    }

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'color',
        'background',
        'list',
        'bullet',
        'link',
        'image',
        'video',
        'align',
        'indent',
        'script',
        'direction',
        'code-block',
        'formula',
    ]

    const validateQuill = (value) => {
        let error = ''
        if (!value) {
            error = 'Text is a required field'
        } else if (value.replace(/<\/?[^>]+(>|$)/g, '').length > 10000) {
            error = 'Text is only supported up to 10000 characters'
        }
        return error
    }

    const sortedCategories = categories.sort((a, b) =>
        a.category.localeCompare(b.category)
    )

    const navigate = useNavigate()

    const validationForm = yup.object().shape({
        title: yup
            .string()
            .required('Title is a required field')
            .max(100, 'Title is only supported up to 100 characters'),
        synopsis: yup
            .string()
            .required('Synopsis is a required field')
            .max(150, 'Synopsis is only supported up to 150 characters'),
        image: yup
            .mixed()
            .test('name', 'Image is required', (value) => {
                return value[0] && value[0].name !== ''
            })
            .test('type', 'Image has to be jpeg, jpg, png or gif', (value) => {
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

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/posts/${idposts}`,
                    options
                )
                setPosts(response.data)
                setLoading(false)
                setLoadingPost(false)
                setValue(response.data[0].text)
            } catch (error) {
                console.error(error)
                setLoading(false)
            }
        }
        loadPosts()
    }, [idposts])

    const dataput = async (data, event) => {
        try {
            const formData = new FormData()
            formData.append('file', data.image[0])
            formData.append('title', data.title)
            formData.append('synopsis', data.synopsis)
            formData.append('category', data.category)
            event.preventDefault()
            const error = validateQuill(value)
            if (error) {
                console.log(error)
                return
            }
            formData.append('text', value)
            await axios.put(
                `${process.env.REACT_APP_API_URL}/posts/update/${idposts}`,
                formData,
                options,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )

            toast.success('Post successfully edited', {
                position: toast.POSITION.TOP_CENTER,
            })
            setTimeout(function () {
                navigate(`/post/${idposts}`)
            }, 2500)
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong', {
                position: toast.POSITION.TOP_CENTER,
            })
        }
    }

    if (loading) {
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

    if (loadingPost) {
        return (
            <div className="container mx-auto flex items-center justify-center h-screen ">
                <div className="shadow-lg rounded-xl p-5 bg-slate-50 ">
                    <div>
                        <h1 className="text-center text-5xl font-medium py-5 max-msm:text-4xl">
                            Something went wrong, please logout and try again to
                            login in
                        </h1>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-100 flex items-center justify-center">
            <ToastContainer />

            <div className="container mx-auto">
                <div className="max-h-screen overflow-y-scroll invisible-scroll">
                    <form
                        onSubmit={handleSubmit(dataput)}
                        noValidate
                        encType="multipart/form-data"
                        className="p-5 bg-slate-200 rounded-lg my-5 shadow-xl"
                    >
                        <div className="flex justify-end">
                            <button onClick={onClose}>
                                <AiOutlineClose
                                    className="hover:scale-125 duration-700"
                                    size={36}
                                />
                            </button>
                        </div>

                        {posts.map((x) => (
                            <div>
                                <div className="mb-6">
                                    <label
                                        htmlFor="title"
                                        className="block mb-2 text-lg text-center font-semibold"
                                    >
                                        Title
                                    </label>
                                    <input
                                        defaultValue={x.title}
                                        {...register('title')}
                                        name="title"
                                        type="text"
                                        placeholder="Title"
                                        id="title"
                                        className="text-black block px-3 p-2.5 w-full  rounded-lg border border-black  hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                                    />
                                    <p className=" text-red-500 font-semibold">
                                        {errors.title?.message}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <label
                                        htmlFor="synopsis"
                                        className="block mb-2 text-lg text-center font-semibold"
                                    >
                                        Synopsis
                                    </label>
                                    <input
                                        defaultValue={x.synopsis}
                                        {...register('synopsis')}
                                        name="synopsis"
                                        type="text"
                                        placeholder="Synopsis"
                                        id="synopsis"
                                        className="text-black block px-3 p-2.5 w-full  rounded-lg border border-black  hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                                    />
                                    <p className=" text-red-500 font-semibold">
                                        {errors.synopsis?.message}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <label
                                        htmlFor="category"
                                        className="block mb-2 text-lg text-center font-semibold"
                                    >
                                        Category
                                    </label>
                                    <select
                                        defaultValue={x.category}
                                        {...register('category')}
                                        className="text-black block px-3 p-2.5 w-full  rounded-lg border border-black  hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                                        id="category"
                                        name="category"
                                    >
                                        {sortedCategories.map(
                                            (option, index) => (
                                                <option
                                                    key={index}
                                                    value={option.category}
                                                >
                                                    {option.category}
                                                </option>
                                            )
                                        )}
                                    </select>
                                    <p className=" text-red-500 font-semibold">
                                        {errors.category?.message}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <label
                                        htmlFor="text"
                                        className="block mb-2 text-lg text-center font-semibold"
                                    >
                                        Text
                                    </label>
                                    <div className="bg-white border border-black">
                                        <ReactQuill
                                            value={value}
                                            onChange={setValue}
                                            modules={modules}
                                            formats={formats}
                                        />
                                    </div>
                                    {validateQuill(value) && (
                                        <div className="text-red-500 font-semibold">
                                            {validateQuill(value)}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label
                                        htmlFor="image"
                                        className="block mb-2 text-lg text-center font-semibold"
                                    >
                                        Image
                                    </label>
                                    <div className="flex justify-center items-center">
                                        <input
                                            {...register('image')}
                                            type="file"
                                            name="image"
                                            id="image"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <p className=" text-red-500 text-center font-semibold">
                                        {errors.image?.message}
                                    </p>

                                    {selectedPhoto && (
                                        <div className="mt-2 py-5">
                                            <h1 className="text-center text-lg font-semibold pb-4">
                                                Image Selected
                                            </h1>
                                            <div className="p-1 bg-black mx-auto w-[450px] shadow-xl  max-sm:w-[250px]">
                                                <img
                                                    src={selectedPhoto}
                                                    alt="Selected Photo"
                                                    className=" w-[450px] h-[253px]  max-sm:w-[280px]"
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
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ModalEdit
