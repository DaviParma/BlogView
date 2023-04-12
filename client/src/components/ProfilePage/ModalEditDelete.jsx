import React, { useState, useEffect } from 'react'
import moment from 'moment'
import ModalDelete from './AccountEdit/ModalDelete'
import ModalEdit from './AccountEdit/ModalEdit'
import LikeButton from '../LikeButton'
import { Link } from 'react-router-dom'
import { FaComments } from 'react-icons/fa'
import { MdDateRange } from 'react-icons/md'
import { BiCategoryAlt } from 'react-icons/bi'
import { AiOutlineClose } from 'react-icons/ai'
import axios from 'axios'
import { Pagination } from 'antd'

const ModalEditDelete = ({ id, options, onClose }) => {
    const [sortOption, setSortOption] = useState('newest')
    const [posts, setPosts] = useState([])
    const [total, setTotal] = useState('')
    const [page, setPage] = useState(1)
    const [postPerPage, setPostPerPage] = useState(6)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [deleteid, setDeleteId] = useState(null)
    const [editid, setEditId] = useState(null)

    const sortPosts = (option) => {
        let sortedPosts = [...posts]
        if (option === 'newest') {
            sortedPosts.sort((a, b) => {
                return new Date(b.idposts) - new Date(a.idposts)
            })
        } else if (option === 'oldest') {
            sortedPosts.sort((a, b) => {
                return new Date(a.idposts) - new Date(b.idposts)
            })
        } else if (option === 'likes') {
            sortedPosts.sort((a, b) => {
                return b.total_likes - a.total_likes
            })
        } else if (option === 'comments') {
            sortedPosts.sort((a, b) => {
                return b.total_comments - a.total_comments
            })
        }
        return sortedPosts
    }

    const handleDeleteButtonClick = (idposts) => {
        setDeleteId(idposts)
        setShowDeleteModal(true)
    }

    const handleEditButtonClick = (idposts) => {
        setEditId(idposts)
        setShowEditModal(true)
    }

    const handleCloseModal = () => {
        setShowDeleteModal(false)
        setDeleteId(false)
        setShowEditModal(false)
        setEditId(false)
    }

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/posts/user/${id}`
                )
                setPosts(response.data)
                setTotal(response.data.length)
            } catch (error) {
                console.error(error)
            }
        }
        loadPosts()
    }, [id])

    const indexOfLastPage = page * postPerPage
    const indexOfFirstPage = indexOfLastPage - postPerPage
    const sortedPosts = sortPosts(sortOption)
    const currentPosts = sortedPosts.slice(indexOfFirstPage, indexOfLastPage)

    const onShowSizeChange = (current, pageSize) => {
        setPostPerPage(pageSize)
    }

    const itemRender = (current, type, originalElement) => {
        if (type === 'prev') {
            return <a>Previous</a>
        }
        if (type === 'next') {
            return <a>Next</a>
        }

        return originalElement
    }

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-100 flex items-center justify-center ">
            <div className="container mx-auto max-h-screen overflow-y-scroll invisible-scroll  py-10 ">
                <div className="py-10 bg-white rounded-xl shadow-xl ">
                    <div className="flex justify-end mx-5 pb-5">
                        <button onClick={onClose}>
                            <AiOutlineClose
                                className="hover:scale-125 duration-700"
                                size={40}
                            />
                        </button>
                    </div>

                    <div className="container mx-auto flex items-center justify-center py-5">
                        <div className="shadow-lg rounded-xl px-20 py-1 bg-white border border-black max-sm:px-10 max-msm:px-5">
                            <div className="flex justify-center items-center  py-5">
                                <h1 className="text-2xl font-semibold px-4 pb-1">
                                    Order By
                                </h1>
                                <select
                                    className="border text-center border-black shadow-xl rounded-lg py-1 px-2"
                                    name="sort"
                                    onChange={(e) =>
                                        setSortOption(e.target.value)
                                    }
                                >
                                    <option value="newest" className="py-1">
                                        Newest
                                    </option>
                                    <option value="oldest" className="py-1">
                                        Oldest
                                    </option>
                                    <option value="likes" className="py-1">
                                        Most likes
                                    </option>
                                    <option value="comments" className="py-1">
                                        Most comments
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 place-items-center gap-20 max-lg:gap-10  max-md:grid-cols-1  ">
                        {currentPosts.map((post) => (
                            <div className="bg-white p-10 rounded-md shadow-2xl border border-black w-[450px] max-xl:w-[400px] max-lg:w-[330px] max-msm:w-[280px] ">
                                <div className="flex justify-between items-center">
                                    <p className="flex items-center text-xl font-bold">
                                        <span className="text-green-500  mx-1 mt-1">
                                            <FaComments size={40} />
                                        </span>
                                        {post.total_comments}
                                    </p>
                                    <LikeButton postId={post.idposts} />
                                </div>
                                <div className="text-center">
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/images/${post.image}`}
                                        alt="Image Post"
                                        className="my-4 mx-auto w-[400px] h-[300px]  max-msm:max-w-full max-msm:h-auto"
                                    />
                                    <h1 className="my-4 text-3xl  max-msm:text-2xl">
                                        {post.title}
                                    </h1>
                                    <p className="my-4 text-lg">
                                        {post.synopsis}
                                    </p>

                                    <div className="flex justify-center items-center my-4">
                                        <BiCategoryAlt size={22} />
                                        <p className="mx-1">{post.category}</p>
                                    </div>

                                    <div className="flex justify-center items-center my-4">
                                        <MdDateRange size={22} />
                                        <p className="mx-1">
                                            {moment(post.date_post).fromNow()}{' '}
                                        </p>
                                    </div>

                                    <div className="flex justify-around items-center py-4">
                                        <button
                                            onClick={() =>
                                                handleEditButtonClick(
                                                    post.idposts
                                                )
                                            }
                                            className="flex mx-auto bg-green-400 px-5 py-3 text-xl  font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 "
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteButtonClick(
                                                    post.idposts
                                                )
                                            }
                                            className="flex mx-auto bg-red-500 px-5 py-3 text-xl  font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 "
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <Link to={`/post/${post.idposts}`}>
                                        <button className="flex mx-auto bg-cyan-400 px-5 py-3 text-xl  font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 ">
                                            View the post
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {showDeleteModal && (
                            <ModalDelete
                                idposts={deleteid}
                                options={options}
                                onClose={handleCloseModal}
                            />
                        )}
                        {showEditModal && (
                            <ModalEdit
                                idposts={editid}
                                options={options}
                                onClose={handleCloseModal}
                            />
                        )}
                    </div>

                    <div className="flex justify-center items-center pt-20">
                        <div className="bg-white p-4 rounded-xl border shadow-2xl">
                            <Pagination
                                onChange={(value) => setPage(value)}
                                pageSize={postPerPage}
                                total={total}
                                current={page}
                                showQuickJumper
                                itemRender={itemRender}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalEditDelete
