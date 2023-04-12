import React from 'react'

const Footer = () => {
    return (
        <footer className="mx-auto py-10 bg-white">
            <div className="text-lg text-center text-[#5C6574] font-semibold">
                <p>©{new Date().getFullYear()} BlogView All rights reserved</p>
            </div>
        </footer>
    )
}

export default Footer
