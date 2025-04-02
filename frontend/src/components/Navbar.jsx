import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HomeIcon from '@mui/icons-material/Home';

function Navbar() {
  const { address } = useAccount();
  const navigate = useNavigate()
  useEffect(() => {
    if (!address) navigate('/')
  }, [address]);
  const handleScrollToFeature = () => {
    const featureSection = document.getElementById("feature-section");
    const offset = 200;
    const position = featureSection.offsetTop - offset;

    window.scrollTo({
      top: position,
      behavior: "smooth",
    });
  };

  const handleScrollToHome = () => {
    const featureSection = document.getElementById("home-section");
    const offset = 200;
    const position = featureSection.offsetTop - offset;

    window.scrollTo({
      top: position,
      behavior: "smooth",
    });
  };
  const handleScrollToService = () => {
    const featureSection = document.getElementById("service-section");
    const offset = 200;
    const position = featureSection.offsetTop - offset;

    window.scrollTo({
      top: position,
      behavior: "smooth",
    });
  };
  return (
    <>
      <div className='fixed top-0 left-0 w-full bg-[#161920] shadow-2xl px-44 z-50 flex justify-between items-center'>
        <div className=' text-4xl font-bold my-5 text-green-500 cursor-pointer' onClick={() => navigate('/')} >Cha<span className=' border-gray-500 border-[2px] rounded-sm border-dashed text-white'>in</span>voice</div>
        <div className='py-7 hidden md:block'>
          <ul className='flex gap-10 items-center text-white'>
            {
              address && (
                <li className='hover:text-green-500 hover:font-bold transition duration-500 flex gap-1 items-center'>
                  <HomeIcon />
                  <Link to='home/sent'>Home</Link>
                </li>
              )
            }
            {
              !address && (
                <div className='flex gap-6'>
                  <li className='hover:text-green-500 hover:font-bold transition duration-500'>
                    <button onClick={() => handleScrollToHome()}>Home</button>
                  </li>
                  <li className='hover:text-green-500 hover:font-bold transition duration-500'>
                    <button onClick={() => handleScrollToFeature()}>Feature</button>
                  </li>
                  <li className='hover:text-green-500 hover:font-bold transition duration-500'>
                    <button onClick={() => handleScrollToService()}>Services</button>
                  </li>
                </div>

              )
            }
            {/* <li className='hover:text-green-500 hover:font-bold transition duration-500'>
              <Link to='working'>How It Works</Link>
              </li> */}

            {
              address && (
                <li className='hover:text-green-500 hover:font-bold transition duration-500 flex gap-1'>
                  <AccountBalanceWalletIcon />
                  <Link to='treasure'>Treasure</Link>
                </li>
              )
            }
            {/* <li className='hover:text-green-500 hover:font-bold transition duration-500'>
              <Link to='about'>About Us</Link>
            </li> */}
            <ConnectButton accountStatus="address" chainStatus="none" />

          </ul>
        </div>
      </div>

      {/* Add padding to prevent content from being hidden behind the navbar */}
      <div className="pt-[80px]"></div>

    </>
  )
}

export default Navbar;
