import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

function Landing() {
    const Account=useAccount();
    const navigate=useNavigate();

    useEffect(()=>{
        if(Account.address) navigate('/home');
    },[Account,Account.address])
    return (
        <>
            <div className=" grid justify-center text-center my-20 font">
                <p className=" font-bold text-5xl text-green-500">Decentralized Payment Requests <br />& Invoice Automation</p>
                <p className=" mx-52 my-5  text-xl">One click to effortless invoicing — process payments in any ERC20 token with transparency and trustless efficiency!</p>
                <p className=" font-bold text-xl text-gray-500">Only with</p>
                <div className=' text-5xl font-bold my-9'>Cha<span className=' border-slate-500 border-[2px] rounded-sm border-dashed text-green-500'>in</span>voice</div>

                <p>Connect with your wallet and Get Started!</p>
                <div className=" flex justify-center my-10">
                    <ConnectButton/>    
                </div>

                <div className=" flex justify-center item-center gap-5">
                    <p className=" flex justify-center item-center gap-2"><img src="star.svg" alt="" width={20}/>Trusted by 1000+ users</p>
                    <p className=" flex justify-center item-center gap-2"><img src="correct.svg" alt="" width={20}/>Smart Contract Driven 100% Secure</p>
                </div>
            </div>
        </>
    )
}
export default Landing;
