import React from 'react'

function SentInvoice() {
  return (
    <div>
      <h2 className="text-lg font-bold">Your Sent Invoice Request</h2>
      <ul>
        <li className="m-4 grid grid-cols-12 items-center border p-3 shadow-lg rounded-md cursor-pointer">
          <p className="col-span-8">Client : 0x24F13d40C.............5F2242e81f1e2</p>
          <p className="col-span-3">Date : {new Date().toISOString()}</p>
          <button className='text-sm bg-red-600 rounded-full text-white font-bold col-span-1'>Not Paid</button>
        </li>
        <li className="m-4 grid grid-cols-12 items-center border p-3 shadow-lg rounded-md cursor-pointer">
          <p className="col-span-8">Client : 0x24F13d40C.............5F2242e81f1e2</p>
          <p className="col-span-3">Date : {new Date().toISOString()}</p>
          <button className='text-sm bg-green-600 rounded-full text-white font-bold col-span-1'>Paid</button>
        </li>
      </ul>
    </div>
  )
}

export default SentInvoice