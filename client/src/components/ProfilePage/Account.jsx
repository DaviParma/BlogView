import React, { useEffect, useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import ModalName from './AccountEdit/ModalName'
import ModalPhoto from './AccountEdit/ModalPhoto'
import ModalBiography from './AccountEdit/ModalBiography'
import ModalEditDelete from './ModalEditDelete'
import ModalCreate from './ModalCreate'
import axios from 'axios'

const Account = () => {
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('userID')

    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const [posts, setPosts] = useState([])
    const [information, setInformation] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [showNameModal, setShowNameModal] = useState(false)
    const [showPhotoModal, setShowPhotoModal] = useState(false)
    const [showBiographyModal, setShowBiographyModal] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditDeleteModal, setShowEditDeleteModal] = useState(false)

    const handleNameButtonClick = () => {
        setShowNameModal(true)
    }

    const handlePhotoButtonClick = () => {
        setShowPhotoModal(true)
    }

    const handleBiographyButtonClick = () => {
        setShowBiographyModal(true)
    }

    const handleCreateButtonClick = () => {
        setShowCreateModal(true)
    }

    const handleEditDeleteButtonClick = () => {
        setShowEditDeleteModal(true)
    }

    const handleCloseModal = () => {
        setShowNameModal(false)
        setShowPhotoModal(false)
        setShowBiographyModal(false)
        setShowCreateModal(false)
        setShowEditDeleteModal(false)
    }

    useEffect(() => {
        const loadUserInformation = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/user/${id}`,
                    options
                )
                setInformation(response.data)
                setLoading(false)
                setLoadingProfile(false)
            } catch (error) {
                console.error(error)
                setLoading(false)
            }
        }
        loadUserInformation()
    }, [id])

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/posts/user/${id}`
                )
                setPosts(response.data)
            } catch (error) {
                console.log(error)
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

    if (loadingProfile) {
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
        <div className="container mx-auto  py-10 max-msm:w-[280px]">
            <div className="container  mx-auto py-10">
                <div className="bg-white rounded-xl shadow-xl ">
                    <h1 className="text-3xl font-semibold text-center py-10 max-sm:text-2xl">
                        Manage Your Profile
                    </h1>

                    <h1 className="text-center text-xl font-semibold py-5">
                        {information.name}
                    </h1>

                    <div className="flex justify-center items-center py-1">
                        <button
                            onClick={handleNameButtonClick}
                            className="flex mx-auto bg-green-400 px-5 py-3 text-xl  font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 "
                        >
                            Edit Your Name
                        </button>
                    </div>

                    <div className="grid grid-cols-2 place-items-center pb-10 max-md:grid-cols-1">
                        <div>
                            <h1 className="text-center text-xl font-semibold pt-10">
                                Photo
                            </h1>
                            {information.photo ===
                            '1680599546975_photodefault.jpg' ? (
                                <div>
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/images/${information.photo}`}
                                        alt="profile_photo"
                                        className="my-5 mx-auto rounded-full h-28 w-28"
                                    />
                                    <div className="py-1">
                                        <button
                                            onClick={handlePhotoButtonClick}
                                            className="flex mx-auto bg-cyan-300 px-5 py-3 text-xl  font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 "
                                        >
                                            Create A Photo
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/images/${information.photo}`}
                                        alt="profile_photo"
                                        className="my-5 mx-auto rounded-full h-28 w-28"
                                    />
                                    <div className="py-1">
                                        <button
                                            onClick={handlePhotoButtonClick}
                                            className="flex mx-auto bg-green-400 px-5 py-3 text-xl  font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 "
                                        >
                                            Edit Your Photo
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="py-1">
                            <h1 className="text-center text-xl font-semibold pt-10">
                                Biography
                            </h1>
                            {information.biography ? (
                                <div>
                                    <p className="text-center py-4 w-[350px] max-sm:w-[280px]">
                                        {information.biography}
                                    </p>

                                    <div className="py-1">
                                        <button
                                            onClick={handleBiographyButtonClick}
                                            className="flex mx-auto bg-green-400 px-5 py-3 text-xl  font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 "
                                        >
                                            Edit Your Biography
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleBiographyButtonClick}
                                    className="my-4 flex mx-auto bg-cyan-300 px-5 py-3 text-xl  font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 "
                                >
                                    Create A Biography
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {showNameModal && (
                    <ModalName
                        name={information.name}
                        id={id}
                        options={options}
                        onClose={handleCloseModal}
                    />
                )}
                {showPhotoModal && (
                    <ModalPhoto
                        id={id}
                        options={options}
                        onClose={handleCloseModal}
                    />
                )}
                {showBiographyModal && (
                    <ModalBiography
                        id={id}
                        options={options}
                        onClose={handleCloseModal}
                    />
                )}

                <div className="bg-white my-20 rounded-xl shadow-xl ">
                    <h1 className="text-3xl font-semibold text-center pt-10 max-sm:text-2xl">
                        Create A Post Or Manage
                    </h1>

                    <div className="grid grid-cols-2 place-items-center  my-20 rounded-xl shadow-xl max-sm:grid-cols-1">
                        <div className="pb-20 ">
                            <button
                                onClick={handleCreateButtonClick}
                                className="flex mx-auto bg-cyan-300 px-5 py-3 text-xl  font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700"
                            >
                                Create A New Post
                            </button>

                            {showCreateModal && (
                                <ModalCreate
                                    id={id}
                                    options={options}
                                    onClose={handleCloseModal}
                                />
                            )}
                        </div>

                        <div className="pb-20 ">
                            {posts.length > 0 ? (
                                <div>
                                    <button
                                        onClick={handleEditDeleteButtonClick}
                                        className=" flex mx-auto bg-green-400 px-5 py-3 text-xl  font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 "
                                    >
                                        Manage your posts
                                    </button>

                                    {showEditDeleteModal && (
                                        <ModalEditDelete
                                            id={id}
                                            options={options}
                                            onClose={handleCloseModal}
                                        />
                                    )}
                                </div>
                            ) : (
                                <h1 className="text-2xl  max-sm:text-xl">
                                    You dont have any post created
                                </h1>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Account
