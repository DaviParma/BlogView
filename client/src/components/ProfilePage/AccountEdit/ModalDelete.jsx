import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { AiOutlineClose } from 'react-icons/ai'

const ModalDelete = ({ idposts, options, onClose }) => {
    function deletePost() {
        toast.success('Post deleted successfully', {
            position: toast.POSITION.TOP_CENTER,
        })
        axios.delete(`${process.env.REACT_APP_API_URL}/posts/delete/${idposts}`, options)
        setTimeout(function () {
            window.location.reload(false)
        }, 2500)
    }

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-100 flex items-center justify-center">
            <ToastContainer />

            <div className="bg-white rounded-lg p-8">
                <div className="flex justify-end">
                    <button onClick={onClose}>
                        <AiOutlineClose
                            className="hover:scale-125 duration-700"
                            size={36}
                        />
                    </button>
                </div>

                <h1 className="text-2xl text-center font-semibold py-5">
                    Are you sure do you want to delete?
                </h1>

                <button
                    className="flex mx-auto bg-red-500 px-5 py-3 text-xl  font-bold border border-black rounded-lg shadow-black shadow-md hover:scale-105 duration-700 "
                    onClick={() => deletePost(idposts)}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default ModalDelete
