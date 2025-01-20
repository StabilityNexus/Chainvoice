import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

function Navbar() {
  const {address}=useAccount();
  const navigate=useNavigate()
  useEffect(()=>{
    if(!address) navigate('/')
  },[address]);

  return (
    <>
    <div className=' h-14 my-5 flex justify-between items-center'>
        <div className=' text-4xl font-bold'>Cha<span className=' border-slate-500 border-[2px] rounded-sm border-dashed text-green-500'>in</span>voice</div>
        <div className=' '>
          <ul className='flex gap-10 items-center'>
            <li>
              <Link to='home'>Home</Link>
            </li>
            <li>
              <Link to='feature'>Feature</Link>
            </li>
            <li>
              <Link to='working'>How It Works</Link>
            </li>
            <li>
              <Link to='security'>Security</Link>
            </li>
            <li>
              <Link to='about'>About Us</Link>
            </li>
            {
              address && <ConnectButton accountStatus="address" chainStatus="none"/>
            }
          </ul>
        </div>
    </div>
    <div className='border-[0.5px] p-0 border-slate-400'></div>

    </>
  )
}

export default Navbar;