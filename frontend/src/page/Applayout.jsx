// AppLayout.js
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

function Applayout() {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <main className="flex-1 pt-24 mx-auto w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Applayout;
