import React from 'react'

function Footer() {
    return (
        <>
            <footer className=" text-center text-white mt-auto">
                <div className="container mx-auto">
                    {/* <p className='text-xl font-bold'>Project by</p>
                    <div className='flex justify-center items-center flex-col'>
                        <img src="logo-animated.gif" alt="" width={50} className='mb-2'/>
                        <img src="horizontal-nexus.png" alt="" />
                    </div> */}
                    <p className="text-sm my-3">
                        &copy; {new Date().getFullYear()} Chainvoice. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    )
}

export default Footer