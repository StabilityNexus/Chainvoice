// AppLayout.js

import Navbar from "@/components/Navbar";

import { Outlet } from "react-router-dom";

function Applayout() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-[#161920]">
      <Navbar />
      {/* Navbar is fixed at h-24, so the offset has to match it exactly —
          pt-20 left content tucked 16px underneath. */}
      <main className="flex-1 pt-24 w-full max-w-[100vw] overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default Applayout;
