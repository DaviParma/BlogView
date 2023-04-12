import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Search = () => {
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!search) return

        navigate(`/search/${search}`)
        setSearch('')
    }

    return (
        <div className="justify-around items-center flex ">
            <form onSubmit={handleSubmit} className="shadow rounded-lg ">
                <input
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    type="text"
                    className="px-32 py-1 text-center text-xl border border-black rounded-lg placeholder:italic hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-1 hover:scale-105 duration-700 max-md:px-10 max-msm:px-5"
                    placeholder="Search a post..."
                />
            </form>
        </div>
    )
}

export default Search
