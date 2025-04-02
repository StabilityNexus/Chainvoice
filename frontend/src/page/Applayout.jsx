import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

function Applayout() {
    return (
        <>
        <div className="flex flex-col h-full">
            <Navbar />
            <div className="md:mx-auto">
            <Outlet />
            </div>
            <Footer/>
        </div>
        </>
    )
}

export default Applayout;