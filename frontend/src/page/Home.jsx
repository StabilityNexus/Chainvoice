import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';

function Home() {
  const navigate=useNavigate();
  return (
    <>
    <div className='font-Montserrat'>
      <p className=' text-4xl font-bold my-10'>Welcome <span className='text-green-500'>Back !</span></p>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 border rounded-xl p-4">
          <Button variant="ghost" className="w-full m-2 border rounded-xl focus:bg-green-500" onClick={()=>navigate('create')} >Create New Invoice Request</Button>
          <Button variant="ghost" className="w-full m-2 border rounded-xl focus:bg-green-500" onClick={()=>navigate("pending")}>Pending Payment Requests</Button>
          <Button variant="ghost" className="w-full m-2 border rounded-xl focus:bg-green-500" onClick={()=>navigate("sent")}>Sent Payment Requests</Button>
        </div>
        <div className="col-span-9 border border-gray-200 p-4">
          <Outlet/>
        </div> 
      </div>
    </div>
    </>
  )
}

export default Home