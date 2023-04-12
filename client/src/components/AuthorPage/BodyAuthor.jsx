import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { MdDateRange } from 'react-icons/md'
import { TailSpin } from 'react-loader-spinner'
import PostAuthor from './PostAuthor'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const BodyAuthor = () => {
    const [author, setAutor] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingAuthor, setLoadingAuthor] = useState(true)
    const { name } = useParams()

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/author/${name}`
                )
                setAutor(response.data)
                console.log(author.name)
                setLoading(false)
                setLoadingAuthor(false)
            } catch (error) {
                console.error(error)
                setLoading(false)
            }
        }
        loadPosts()
    }, [name])

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

    if (loadingAuthor) {
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
        <div className="container mx-auto">
            <div className="bg-slate-50 mx-auto my-10 w-[600px] rounded-xl shadow-xl max-md:w-[380px] max-sm:w-[280px]">
                <div className="mx-auto w-[450px] max-md:w-[280px]">
                    <div className=" flex items-center justify-center py-5">
                        <img
                            src={`${process.env.REACT_APP_API_URL}/images/${author[0].photo}`}
                            className="rounded-full h-28 w-28"
                        />
                        <p className="mx-2 text-center">{author[0].name}</p>
                    </div>

                    <p className="mx-10 text-center">{author[0].biography}</p>

                    <div className="flex justify-center items-center py-5">
                        <MdDateRange size={22} />
                        <p className="mx-1">
                            {moment(author[0].date_user).fromNow()}{' '}
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <PostAuthor id={author[0].id} nameauthor={author[0].name} />
            </div>
        </div>
    )
}

export default BodyAuthor
