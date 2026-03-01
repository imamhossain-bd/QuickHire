
import React from 'react'
import Navbar from '../Sheard/Navbar'
import Footer from '../Sheard/Footer'
import { Outlet } from 'react-router-dom'

const Root = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}

export default Root