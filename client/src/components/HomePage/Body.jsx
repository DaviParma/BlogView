
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import LikeButton from '../LikeButton'
import { FaComments } from 'react-icons/fa'
import { MdDateRange } from 'react-icons/md'
import { BiCategoryAlt } from 'react-icons/bi'
import { TailSpin } from 'react-loader-spinner'
import { Link } from 'react-router-dom'
import { Pagination } from 'antd'
import axios from 'axios'

const Body = () => {
    console.log(process.env.REACT_APP_API_URL)
    const [sortOption, setSortOption] = useState('newest')
    const [posts, setPosts] = useState([])
    const [total, setTotal] = useState('')
    const [page, setPage] = useState(1)
    const [postPerPage, setPostPerPage] = useState(6)
    const [loading, setLoading] = useState(true)
    const [loadingPosts, setLoadingPosts] = useState(true)

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

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts`);
                setPosts(response.data)
                setTotal(response.data.length)
                setLoading(false)
                setLoadingPosts(false)
            } catch (error) {
                console.error(error)
                setLoading(false)
            }
        }
        loadPosts()
    }, [])

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

    if (loadingPosts) {
        return (
            <div className="container mx-auto flex items-center justify-center h-screen ">
                <div className="shadow-lg rounded-xl p-5 bg-slate-50 ">
                    <div>
                        <h1 className="text-center text-5xl font-medium py-5 max-msm:text-4xl">
                            There is no post created
                        </h1>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto">
            <div className="my-10">
                <div className="container mx-auto flex items-center justify-center py-5">
                    <div className="shadow-lg rounded-xl px-20 py-1 bg-white max-sm:px-10 max-msm:px-5">
                        <div className="flex justify-center items-center  py-5">
                            <h1 className="text-2xl font-semibold px-4 pb-1">
                                Order By
                            </h1>
                            <select
                                className="border text-center border-black shadow-xl rounded-lg py-1 px-2"
                                name="sort"
                                onChange={(e) => setSortOption(e.target.value)}
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

                <div className="grid grid-cols-2 place-items-center gap-20  max-md:grid-cols-1 ">
                    {currentPosts.map((post) => (
                        <div className="bg-white  p-10 rounded-md shadow-2xl  w-[450px] max-lg:w-[350px] max-msm:w-[280px]">
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
                                <p className="my-4 text-lg">{post.synopsis}</p>

                                <div className="flex justify-center items-center my-4">
                                    <BiCategoryAlt size={22} />
                                    <Link to={'/category/' + post.category}>
                                        <a className="text-cyan-500 font-semibold underline underline-offset-4 mx-1">
                                            {post.category}
                                        </a>
                                    </Link>
                                </div>

                                <div className="flex justify-center items-center my-4">
                                    <MdDateRange size={22} />
                                    <p className="mx-1">
                                        {moment(post.date_post).fromNow()}{' '}
                                    </p>
                                </div>
                                <Link
                                    to={{ pathname: `/post/${post.idposts}` }}
                                >
                                    <button className="my-4 bg-cyan-300 p-4 font-bold text-xl border border-black rounded-lg shadow-xl hover:scale-110 duration-700 max-msm:my-3 max-msm:p-3">
                                        Continue Reading
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center items-center py-20">
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
    )
}

export default Body
