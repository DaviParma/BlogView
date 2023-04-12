import React, { useEffect, useState } from 'react'
import moment from 'moment'
import AddComment from './AddComment'
import Comments from './Comments'
import LikeButton from '../LikeButton'
import { TailSpin } from 'react-loader-spinner'
import { FaComments } from 'react-icons/fa'
import { MdDateRange } from 'react-icons/md'
import { BiCategoryAlt } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const BodyPost = () => {
    const { id } = useParams()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingPosts, setLoadingPosts] = useState(true)

    const iduser = localStorage.getItem('userID')

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/posts/${id}`
                )
                setPosts(response.data)
                setLoading(false)
                setLoadingPosts(false)
            } catch (error) {
                console.error(error)
                setLoading(false)
            }
        }
        loadPosts()
    }, [id])

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
        <div>
            {posts.map((post) => (
                <div className="container mx-auto">
                    <div className="my-10 flex justify-center items-center">
                        <div className="bg-white p-10 text-black text-center rounded-lg  shadow-xl max-msm:w-[280px]">
                            <div className="flex justify-between items-center">
                                <p className="flex items-center text-xl font-bold">
                                    <span className="text-green-500  mx-1 mt-1">
                                        <FaComments size={40} />
                                    </span>
                                    {post.total_comments}
                                </p>
                                <LikeButton postId={post.idposts} />
                            </div>
                            <h1 className="pt-4 text-4xl font-semibold max-md:text-3xl max-msm:text-2xl">
                                {post.title}
                            </h1>
                            <p className="py-4 text-lg ">{post.synopsis}</p>

                            <div className="flex py-4 justify-center items-center ">
                                <img
                                    src={`${process.env.REACT_APP_API_URL}/images/${post.photo}`}
                                    className="mx-1 rounded-full h-28 w-28"
                                />
                                <Link to={'/author/' + post.name}>
                                    <p className="text-cyan-500 font-semibold underline underline-offset-4 mx-1">
                                        {post.name}
                                    </p>
                                </Link>
                            </div>

                            <div className="flex justify-center items-center pt-4 pb-16">
                                <MdDateRange size={22} />
                                <h3 className="mx-1">
                                    {moment(post.date_post).fromNow()}{' '}
                                </h3>
                            </div>
                            <img
                                src={`${process.env.REACT_APP_API_URL}/images/${post.image}`}
                                alt="Image Post"
                                className="my-4 mx-auto w-[400px] h-[350px]  max-sm:max-w-full max-sm:h-auto"
                            />
                            <div
                                className="py-10"
                                dangerouslySetInnerHTML={{ __html: post.text }}
                            />
                            <div className="flex justify-center items-center">
                                <BiCategoryAlt size={22} />
                                <Link to={'/category/' + post.category}>
                                    <a className="text-cyan-500 font-semibold underline underline-offset-4 mx-1">
                                        {post.category}
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto p-10 bg-white rounded-lg shadow-xl my-10 max-msm:w-[280px]">
                        <h1 className="text-5xl text-center font-semibold max-msm:text-4xl">
                            Comments
                        </h1>
                        {iduser ? (
                            <AddComment idpost={post.idposts} iduser={iduser} />
                        ) : (
                            <h1 className="text-2xl text-center py-10">
                                You must be logged in to comment
                            </h1>
                        )}
                        <Comments
                            idpost={post.idposts}
                            iduser={iduser}
                            total_comments={post.total_comments}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default BodyPost
