import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import ShieldIcon from '@mui/icons-material/Shield';
import EmailIcon from '@mui/icons-material/Email';
import GavelIcon from '@mui/icons-material/Gavel';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
function Landing() {
    const Account = useAccount();
    const navigate = useNavigate();

    useEffect(() => {
        if (Account.address) navigate('/home/sent');
    }, [Account, Account.address])
    return (
        <>
            <div className=" grid md:grid-cols-2 justify-center text-center mt-32 font bg-[#161920]  md:px-44 ">
                <div id="home-section">
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
            <section className="flex flex-wrap items-center justify-between px-12 mt-96 mb-24  md:px-44 " id="feature-section">

                <div className="w-[50%] space-y-6">
                    <p className="text-4xl font-bold text-gray-800">
                        A powerful and secure{" "}
                        <span className="text-green-500 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                            invoicing solution
                        </span>{" "}
                        designed for growing businesses.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        {[
                            {
                                title: "Secure and Transparent Transactions",
                                description:
                                    "Leverage blockchain technology to ensure encrypted, tamper-proof, and immutable transactions. Provide complete transparency for invoice verification.",
                                icon: <ShieldIcon />,
                            },
                            {
                                title: "Send and Receive Invoices",
                                description:
                                    "Effortlessly create and manage invoices with a few clicks. Track real-time status and maintain a comprehensive invoice dashboard.",
                                icon: <EmailIcon />,
                            },
                            {
                                title: "Smart Contract Integration",
                                description:
                                    "Automate payment processes with secure smart contracts. Ensure funds are released only when invoice conditions are met, reducing intermediary dependencies.",
                                icon: <GavelIcon />,
                            },
                            {
                                title: "Comprehensive Invoice Tracking",
                                description:
                                    "Gain complete visibility into your invoice lifecycle. Monitor payment statuses, track financial performance, and manage all transactions seamlessly.",
                                icon: <LeaderboardIcon />,
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                <div className="bg-green-500 w-12 h-12 flex items-center justify-center rounded-lg mb-4 text-white">
                                    <span className="text-2xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                                <p className="mt-2 text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-[50%] flex items-center justify-center ">
                    <img src="invoice.png" alt="Invoice Illustration" className="max-w-full" />
                </div>
            </section>
            <section className="bg-[#161920] pt-10 pb-16" id="service-section">
                <div className="flex justify-center">
                    <img src="/aeroplane2.png" alt="Aeroplane 2" className="w-32 h-auto" />
                    <div>
                        <p className="text-center text-white font-bold text-4xl"> Start Sending Your</p>
                        <p className="text-center text-green-500 font-bold text-4xl">Invoice Today!</p>
                    </div>
                    <img src="/aeroplane1.png" alt="Aeroplane 1" className="w-32 h-auto" />
                </div>

                <footer className=" text-white py-8">
                    <div className="container mx-auto flex flex-col md:flex-row justify-around items-center px-6">
                        <div>
                            <div className=' text-4xl font-bold my-5 text-green-500'>Cha<span className=' border-gray-500 border-[2px] rounded-sm border-dashed text-white'>in</span>voice</div>
                            <p className="text-gray-400 mt-1">Secure & Smart Invoicing</p>
                        </div>
                        <div className="flex gap-10">

                            <div >
                                <h3 className="text-lg font-semibold">Quick Links</h3>
                                <ul className="mt-2 space-y-1">
                                    {["Home", "Feature", "Treasure", "Service", "Invoice"].map((link) => (
                                        <li key={link}>
                                            <a href={`#${link.toLowerCase()}`} className="text-gray-300 hover:text-green-400">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Services</h3>
                                <ul className="mt-2 space-y-1">
                                    {["Blog & Article", "Terms ans Conditions", "Privacy Policy", "Contact Us", "Invoice"].map((link) => (
                                        <li key={link}>
                                            <a href={`#${link.toLowerCase()}`} className="text-gray-300 hover:text-green-400">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Contact</h3>
                                <ul className="mt-2 space-y-1">
                                    {["chainvoice@gmail.com"].map((link) => (
                                        <li key={link}>
                                            <a href={`#${link.toLowerCase()}`} className="text-gray-300 hover:text-green-400">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </footer>
            </section>


        </>
    )
}
export default Landing;
