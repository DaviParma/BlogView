import React, { useState } from 'react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import NavbarCategoryModal from './NavbarCategoryModal'
import Search from './Search'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
    const [nav, setNav] = useState(false)
    const handleClick = () => setNav(!nav)

    const [showCategoryModal, setShowCategoryModal] = useState(false)

    const handleCategoryButtonClick = () => {
        setShowCategoryModal(true)
    }

    const handleCloseModal = () => {
        setShowCategoryModal(false)
    }

    const token = localStorage.getItem('token')

    function handleLogout() {
        localStorage.removeItem('userID')
        localStorage.removeItem('token')
        window.location.reload(false)
    }

    return (
        <nav className="w-full mx-auto bg-white py-2 shadow-lg">
            <div className="container mx-auto flex items-center justify-between py-4">
                <NavLink
                    to="/"
                    className={({ isActive }) => {
                        return isActive ? 'text-cyan-500' : 'text-black'
                    }}
                >
                    <h1 className="flex text-4xl cursor-pointer font-myname hover:scale-110 duration-700">
                        BlogView
                    </h1>
                </NavLink>
                <ul className="flex text-lg font-semibold max-md:hidden">
                    <NavLink
                        to="/author"
                        className={({ isActive }) => {
                            return isActive ? 'text-cyan-500' : 'text-black'
                        }}
                    >
                        <li className="px-3 cursor-pointer hover:scale-110 duration-700 hover:underline underline-offset-4">
                            Author
                        </li>
                    </NavLink>
                    <NavLink onClick={handleCategoryButtonClick}>
                        <li className="px-5 cursor-pointer hover:scale-110 duration-700 hover:underline underline-offset-4">
                            Category
                        </li>
                    </NavLink>
                    {showCategoryModal && (
                        <NavbarCategoryModal onClose={handleCloseModal} />
                    )}
                </ul>
                <ul className="flex text-lg font-semibold max-md:hidden">
                    {token ? (
                        <>
                            <NavLink
                                to="/profile"
                                className={({ isActive }) => {
                                    return isActive
                                        ? 'text-cyan-500'
                                        : 'text-black'
                                }}
                            >
                                <li className="px-3 cursor-pointer hover:scale-110 duration-700 hover:underline underline-offset-4">
                                    Profile
                                </li>
                            </NavLink>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) => {
                                    return isActive
                                        ? 'text-cyan-500'
                                        : 'text-black'
                                }}
                            >
                                <li className="px-3 cursor-pointer hover:scale-110 duration-700 hover:underline underline-offset-4">
                                    Login In
                                </li>
                            </NavLink>
                            <NavLink
                                to="/signup"
                                className={({ isActive }) => {
                                    return isActive
                                        ? 'text-cyan-500'
                                        : 'text-black'
                                }}
                            >
                                <li className="px-3 cursor-pointer hover:scale-110 duration-700 hover:underline underline-offset-4">
                                    Sign Up
                                </li>
                            </NavLink>
                        </>
                    )}
                </ul>

                <div className="md:hidden mr-4" onClick={handleClick}>
                    {!nav ? (
                        <MenuIcon className="w-10" />
                    ) : (
                        <XIcon className="w-10" />
                    )}
                </div>
            </div>

            <div className="md:hidden">
                <div
                    className={
                        !nav
                            ? 'hidden'
                            : 'mx-auto  w-full px-8 pb-1 text-center '
                    }
                >
                    <ul className="text-lg font-semibold">
                        <NavLink
                            to="/author"
                            className={({ isActive }) => {
                                return isActive ? 'text-cyan-500' : 'text-black'
                            }}
                        >
                            <li className="px-3 cursor-pointer hover:scale-110 duration-700 hover:underline underline-offset-4">
                                Author
                            </li>
                        </NavLink>
                        <NavLink onClick={handleCategoryButtonClick}>
                            <li className="px-5 cursor-pointer hover:scale-110 duration-700 hover:underline underline-offset-4">
                                Category
                            </li>
                        </NavLink>
                        {showCategoryModal && (
                            <NavbarCategoryModal onClose={handleCloseModal} />
                        )}
                    </ul>

                    <ul className="text-lg font-semibold">
                        {token ? (
                            <>
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) => {
                                        return isActive
                                            ? 'text-cyan-500'
                                            : 'text-black'
                                    }}
                                >
                                    <li className="px-3 cursor-pointer hover:scale-110 duration-700 hover:underline underline-offset-4">
                                        Profile
                                    </li>
                                </NavLink>
                                <button onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) => {
                                        return isActive
                                            ? 'text-cyan-500'
                                            : 'text-black'
                                    }}
                                >
                                    <li className="px-3 cursor-pointer hover:scale-110 duration-700 hover:underline underline-offset-4">
                                        Login In
                                    </li>
                                </NavLink>
                                <NavLink
                                    to="/signup"
                                    className={({ isActive }) => {
                                        return isActive
                                            ? 'text-cyan-500'
                                            : 'text-black'
                                    }}
                                >
                                    <li className="px-3 cursor-pointer hover:scale-110 duration-700 hover:underline underline-offset-4">
                                        Sign Up
                                    </li>
                                </NavLink>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            <div className="container mx-auto my-4 max-md:">
                <Search />
            </div>
        </nav>
    )
}

export default Navbar
