import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const notfound = '404.svg'

function NotFoundPage() {
    return (
        <div>
            <Navbar />
            <div className="py-32">
                <div className="container mx-auto bg-slate-100 text-center rounded-xl shadow-xl max-sm:w-[280px]">
                    <img
                        className="w-96 mx-auto py-5 max-md:w-[280px] max-sm:w-[250px]"
                        src={notfound}
                    />
                    <h1 className=" text-center  text-3xl font-bold py-5 max-md:text-2xl">
                        404 - Page not found
                    </h1>
                    <p className=" text-center text-xl pb-5 max-md:text-lg">
                        Sorry, the page you are looking for does not exist.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default NotFoundPage
