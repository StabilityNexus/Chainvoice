import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

function Applayout() {
    return (
        <>
        <div className="bg-[#161920] flex flex-col h-full">
            <Navbar />
            <div className="md:mx-auto md:px-44 ">
            <Outlet />
            </div>
            <Footer/>
        </div>
        </>
    )
}

export default Applayout;