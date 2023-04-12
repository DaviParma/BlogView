import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { TailSpin } from 'react-loader-spinner'
import { MdDateRange } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { Pagination } from 'antd'
import axios from 'axios'

const BodyAuthorSearch = () => {
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
                return new Date(b.id) - new Date(a.id)
            })
        } else if (option === 'oldest') {
            sortedPosts.sort((a, b) => {
                return new Date(a.id) - new Date(b.id)
            })
        }
        return sortedPosts
    }

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/author`)
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
    }, [posts])

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
                            There is no author created
                        </h1>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="my-10">
            <div className="container mx-auto flex items-center justify-center py-5">
                <div className="shadow-lg rounded-xl px-20 py-1 bg-white max-sm:px-10 max-msm:px-5">
                    <div className="flex justify-center items-center  py-5">
                        <h1 className="text-2xl font-semibold px-4 pb-1">
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
                </div>
            </div>

            <div className="container mx-auto py-10">
                <div className="grid grid-cols-2 place-items-center gap-20 max-md:grid-cols-1">
                    {currentPosts.map((author) => (
                        <div className="bg-slate-50 mx-auto my-10 w-[300px] rounded-xl shadow-xl max-msm:w-[280px]">
                            <div className=" flex items-center justify-center">
                                <img
                                    src={`${process.env.REACT_APP_API_URL}/images/${author.photo}`}
                                    className="rounded-full h-28 w-28 m-5"
                                />
                                <p className="mx-2 text-center">
                                    {author.name}
                                </p>
                            </div>
                            <div className='mx-5'>
                                <p className="text-center">{author.biography}</p>
                            </div>
                            <div className="flex justify-center items-center my-4">
                                <MdDateRange size={22} />
                                <p className="mx-1">
                                    {moment(author.date_user).fromNow()}
                                </p>
                            </div>

                            <div className="flex justify-center items-center py-5">
                                <Link to={`/author/${author.name}`}>
                                    <button className="my-4 bg-cyan-300 p-4 font-bold text-xl border border-black rounded-lg shadow-xl hover:scale-110 duration-700 max-msm:my-3 max-msm:p-3">
                                        View profile
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

export default BodyAuthorSearch
