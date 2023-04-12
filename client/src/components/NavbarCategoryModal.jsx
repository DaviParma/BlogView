import React from 'react'
import categories from './json/categories.json'
import { AiOutlineClose } from 'react-icons/ai'

const NavbarCategoryModal = ({ onClose }) => {
    const sortedCategories = categories.sort((a, b) =>
        a.category.localeCompare(b.category)
    )

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-h-screen overflow-y-scroll invisible-scroll">
                <div className="flex justify-end">
                    <button className="" onClick={onClose}>
                        <AiOutlineClose
                            className="hover:scale-125 duration-700"
                            size={36}
                        />
                    </button>
                </div>

                <div className="py-10 grid grid-cols-3 gap-10 max-md:grid-cols-2 max-sm:grid-cols-1">
                    {sortedCategories.map((option, index) => (
                        <a
                            href={`/category/${option.category}`}
                            key={index}
                            value={option.category}
                            className="border-b text-center border-black hover:scale-105 duration-1000"
                        >
                            {option.category}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NavbarCategoryModal
