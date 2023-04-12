import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from 'moment'
import { FaComments } from 'react-icons/fa'
import { MdDateRange } from 'react-icons/md'
import axios from 'axios'
import { TailSpin } from 'react-loader-spinner'
import { Link } from 'react-router-dom'
import 'react-quill/dist/quill.snow.css'

const Comments = ({ idpost, iduser, total_comments }) => {
    const [editingComment, setEditingComment] = useState(null)
    const [sortOption, setSortOption] = useState('newest')
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingComments, setLoadingComments] = useState(true)

    const token = localStorage.getItem('token')

    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const sortPosts = (option) => {
        let sortedPosts = [...comments]
        if (option === 'newest') {
            sortedPosts.sort((a, b) => {
                return new Date(b.id) - new Date(a.id)
            })
        } else if (option === 'oldest') {
            sortedPosts.sort((a, b) => {
                return new Date(a.id) - new Date(b.id)
            })
        }
        return sortedPosts
    }

    const sortedPosts = sortPosts(sortOption)

    useEffect(() => {
        const loadComments = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/posts/comment/${idpost}`
                )
                setComments(response.data)
                setLoading(false)
                setLoadingComments(false)
            } catch (error) {
                console.error(error)
                setLoading(false)
            }
        }
        loadComments()
    }, [idpost])

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/posts/comment/${commentId}`,
                options
            )
            setComments(comments.filter((comment) => comment.id !== commentId))
            setEditingComment(null)
            toast.success('Comment deleted successfully', {
                position: toast.POSITION.TOP_CENTER,
            })
            setTimeout(function () {
                window.location.reload(false)
            }, 2500)
        } catch (error) {
            console.error(error)
            toast.error('Something went wrong', {
                position: toast.POSITION.TOP_CENTER,
            })
        }
    }

    const handleEditComment = async (e, commentId) => {
        e.preventDefault()
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/posts/comment/${commentId}`,
                { text: comments.find((c) => c.id === commentId).text },
                options
            )
            setEditingComment(null)
            toast.success('Comment successfully edited', {
                position: toast.POSITION.TOP_CENTER,
            })
            setTimeout(function () {
                window.location.reload(false)
            }, 2500)
        } catch (error) {
            console.error(error)
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

    if (loadingComments) {
        return (
            <div className="container mx-auto flex items-center justify-center">
                <h1 className="flex items-center text-center text-3xl font-medium py-5 max-msm:text-4xl">
                    <span className="text-green-500  mx-1 mt-1">
                        <FaComments size={60} />
                    </span>
                    0
                </h1>
            </div>
        )
    }

    return (
        <div className="container mx-auto">
            <div className="flex justify-center items-center">
                <p className="flex items-center text-2xl font-bold">
                    <span className="text-green-500  mx-1 mt-1">
                        <FaComments size={60} />
                    </span>
                    {total_comments}
                </p>
            </div>
            <ToastContainer />
            <div className="flex justify-center items-center  pt-5">
                <h1 className="text-2xl font-semibold px-4 pb-1 max-msm:text-xl">
                    Order By
                </h1>
                <select
                    className="border border-black shadow-xl rounded-lg py-1 px-4"
                    name="sort"
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="newest" className="py-1">
                        Newest
                    </option>
                    <option value="oldest" className="py-1">
                        Oldest
                    </option>
                </select>
            </div>
            {sortedPosts.map((comment) => (
                <div className="my-10 bg-slate-100 rounded-lg shadow-xl">
                    <div className="flex py-4 justify-start items-center max-sm:flex-none max-sm:grid max-sm:place-content-center">
                        <img
                            src={`${process.env.REACT_APP_API_URL}/images/${comment.photo}`}
                            className="mx-4 rounded-full h-20 w-20 max-sm:mx-auto"
                        />
                        <div className="flex flex-col">
                            <Link to={'/author/' + comment.name}>
                                <p className="text-cyan-500 font-semibold underline underline-offset-4 mx-1 max-sm:mx-8">
                                    {comment.name}
                                </p>
                            </Link>
                            <div className="flex items-center  max-sm:mx-5">
                                <MdDateRange size={22} />
                                <h3 className="mx-1 py-1">
                                    {moment(comment.date).fromNow()}{' '}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {editingComment === comment.id ? (
                        <form
                            onSubmit={(e) => handleEditComment(e, comment.id)}
                        >
                            <textarea
                                required
                                maxLength={3000}
                                rows="5"
                                cols="1"
                                name="text"
                                value={comment.text}
                                onChange={(e) =>
                                    setComments(
                                        comments.map((c) =>
                                            c.id === comment.id
                                                ? { ...c, text: e.target.value }
                                                : c
                                        )
                                    )
                                }
                                className=" text-black block px-3 p-2.5 w-full  rounded-lg border border-black hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                            />
                            <div className="flex justify-center items-center py-4">
                                <button
                                    className="bg-green-400 px-5 py-3 text-xl font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 mr-4 max-msm:px-3"
                                    type="submit"
                                >
                                    Save
                                </button>
                                <button
                                    className="bg-red-500 px-5 py-3 text-xl font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 max-msm:px-3"
                                    onClick={() => setEditingComment(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="py-1 ">
                            <p className="bg-white p-2 mx-8 rounded-md shadow-lg max-sm:text-center">
                                {comment.text}
                            </p>
                            <div className="flex justify-center items-center py-4">
                                {iduser === comment.user_id.toString() && (
                                    <button
                                        className="bg-green-400 px-5 py-3 text-xl font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 mr-4 max-msm:px-3"
                                        onClick={() =>
                                            setEditingComment(comment.id)
                                        }
                                    >
                                        Edit
                                    </button>
                                )}
                                {iduser === comment.user_id.toString() && (
                                    <button
                                        onClick={() =>
                                            handleDeleteComment(comment.id)
                                        }
                                        className="bg-red-500 px-5 py-3 text-xl font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 max-msm:px-3"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default Comments
