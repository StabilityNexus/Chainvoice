// AppLayout.js

import Navbar from "@/components/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

function Applayout() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-[#161920]">
      <Navbar />
      <main className="flex-1 pt-20 w-full max-w-[100vw] overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default Applayout;
