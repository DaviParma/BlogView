import React, { useState, useEffect } from 'react'
import { TailSpin } from 'react-loader-spinner'
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const LikeButton = ({ postId }) => {
    const [liked, setLiked] = useState(false)
    const [loading, setLoading] = useState(false)
    const [totalLikes, setTotalLikes] = useState(0)

    const userID = localStorage.getItem('userID')

    const token = localStorage.getItem('token')
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const addLike = async () => {
        setLoading(true)
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/likes`,
                {
                    post_id: postId,
                    user_id: userID,
                },
                options
            )
            setLiked(true)
            setTotalLikes(totalLikes + 1)
        } catch (error) {
            toast.error(
                'Failed to like the post. Please try again later or logout.',
                {
                    position: toast.POSITION.TOP_CENTER,
                }
            )
        }
        setLoading(false)
    }

    const removeLike = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/likes/check?post_id=${postId}&user_id=${userID}`,
                options
            )
            const id_like = response.data.id
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/likes/${id_like}`,
                options
            )
            setLiked(false)
            setTotalLikes(totalLikes - 1)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        const checkLiked = async () => {
            setLoading(true)
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/likes/check?post_id=${postId}&user_id=${userID}`,
                    options
                )
                setLiked(response.data.liked)
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
        checkLiked()

        const getTotalLikes = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/likes/total`
                )
                const likes = response.data.likes
                const total =
                    likes.find((like) => like.post_id === postId)
                        ?.total_likes || 0
                setTotalLikes(total)
            } catch (error) {
                console.log(error)
            }
        }
        getTotalLikes()
    }, [postId, userID])

    const handleButtonClick = async () => {
        if (!userID) {
            toast.error('You must be logged in to like this post.', {
                position: toast.POSITION.TOP_CENTER,
            })
        }

        if (liked) {
            removeLike()
        } else {
            addLike()
        }
    }

    const formatTotalLikes = (totalLikes) => {
        if (totalLikes >= 1000000000) {
            return (totalLikes / 1000000000).toFixed(1).replace('.0', '') + 'B'
        } else if (totalLikes >= 1000000) {
            return (totalLikes / 1000000).toFixed(1).replace('.0', '') + 'M'
        } else if (totalLikes >= 1000) {
            return (totalLikes / 1000).toFixed(1).replace('.0', '') + 'K'
        } else {
            return totalLikes.toLocaleString()
        }
    }

    return (
        <div>
            <ToastContainer />
            <div className="flex justify-center items-center">
                <button disabled={loading} onClick={handleButtonClick}>
                    {loading ? (
                        <TailSpin
                            height="50"
                            width="50"
                            color="black"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                    ) : liked ? (
                        <FaThumbsUp
                            size={40}
                            className="text-cyan-500 hover:scale-110 duration-700"
                        />
                    ) : (
                        <FaRegThumbsUp
                            size={40}
                            className="text-cyan-500 hover:scale-110 duration-700"
                        />
                    )}
                </button>
                <p className="text-xl font-bold mx-1 mt-1">
                    {formatTotalLikes(totalLikes)}
                </p>
            </div>
        </div>
    )
}

export default LikeButton
