import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

function Landing() {
    const Account = useAccount();
    const navigate = useNavigate();

    useEffect(() => {
        if (Account.address) navigate('/home');
    }, [Account, Account.address])
    return (
        <>
            <div className=" grid md:grid-cols-2 justify-center text-center mt-32 font">
                <div>
                    <p className=" font-bold md:text-7xl text-3xl text-white md:mx-4">Decentralized Payment Requests<span className="text-3xl"> &</span><br /><span className="text-green-500">Invoice</span> Automation</p>
                    <p className="  my-5 md:text-xl text-gray-400">One click to effortless invoicing — process payments in any ERC20 token with transparency and trustless efficiency!</p>
                    {/* <p className=" font-bold text-xl text-gray-500">Only with</p>
                <div className=' text-5xl font-bold my-9'>Cha<span className=' border-slate-500 border-[2px] rounded-sm border-dashed text-green-500'>in</span>voice</div> */}

                    <p className=" text-yellow-50 pt-10">Connect with your wallet and Get Started!</p>
                    <div className=" flex justify-center my-5">
                        <ConnectButton />
                    </div>

                    <div className=" md:flex justify-center item-center gap-5 text-yellow-50 ">
                        <p className=" flex justify-center item-center gap-2 py-2"><img src="star.svg" alt="" width={20} />Trusted by 1000+ users</p>
                        <p className=" flex justify-center item-center gap-2 py-2"><img src="correct.svg" alt="" width={20} />Smart Contract Driven 100% Secure</p>
                    </div>
                </div>
                <div className="hidden md:block">
                    <img
                        src="sideImage.png"
                        sizes="(max-width: 480px) 480px, (max-width: 700px) 700px, 1080px"
                        alt=""
                        loading="lazy"
                        className="ml-24 transition-transform duration-500 hover:translate-x-[-10px] hover:scale-105"

                    />

                </div>
            </div>
        </>
    )
}
export default Landing;
