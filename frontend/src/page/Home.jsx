import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

function Home() {
  const [title,setTitle]=useState("pending");
  
  return (
    <>
    <div className='font-Montserrat'>
      <p className=' text-4xl font-bold my-10'>Welcome <span className='text-green-500'>Back !</span></p>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 border rounded-xl p-4">
          <Button variant="ghost" className="w-full mb-2 border rounded-xl focus:bg-green-500" onClick={()=>setTitle("pending")}>Pending Payment Requests</Button>
          <Button variant="ghost" className="w-full border rounded-xl focus:bg-green-500" onClick={()=>setTitle("sent")}>Sent Payment Requests</Button>
        </div>
        <div className="col-span-9 border border-gray-200 p-4">
          <h2 className="text-lg font-bold">{title=="pending" ? "Pending Payment Requests" : "Sent Payment Requests"}</h2>
          <p>This is where additional content can go.</p>
        </div>
      </div>
    </div>
    </>
  )
}

export default Home