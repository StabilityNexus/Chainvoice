import React from 'react'
import { Lock, Send, Layers, BarChart } from 'lucide-react'
import { Link } from 'react-router-dom';
function Feature() {
  const featureData = [
    {
      icon: <Lock className="w-12 h-12 text-blue-600" />,
      title: "Secure and Transparent Transactions",
      description: "Leverage blockchain technology to ensure encrypted, tamper-proof, and immutable transactions. Provide complete transparency for invoice verification.",
      image: "/secure.png",
      width:500
    },
    {
      icon: <Send className="w-12 h-12 text-green-600" />,
      title: "Send and Receive Invoices",
      description: "Effortlessly create and manage invoices with a few clicks. Track real-time status and maintain a comprehensive invoice dashboard.",
      image: "/transaction.png",
      width:500
    },
    {
      icon: <Layers className="w-12 h-12 text-purple-600" />,
      title: "Smart Contract Integration",
      description: "Automate payment processes with secure smart contracts. Ensure funds are released only when invoice conditions are met, reducing intermediary dependencies.",
      image: "/contract.png",
      width:300
    },
    {
      icon: <BarChart className="w-12 h-12 text-orange-600" />,
      title: "Comprehensive Invoice Tracking",
      description: "Gain complete visibility into your invoice lifecycle. Monitor payment statuses, track financial performance, and manage all transactions seamlessly.",
      image: "/image.png",
      width:300
    }
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
        Chainvoice: Simplifying Invoices with Blockchain
      </h1>
      {featureData.map((feature, index) => (
        <div
          key={feature.title}
          className={`grid md:grid-cols-2 gap-8 items-center mb-16 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
        >
          <div className={`space-y-4 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
            <div className="flex items-center space-x-4">
              {feature.icon}
              <h2 className="text-2xl font-semibold text-gray-800">{feature.title}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
          </div>
          <div className="flex justify-center">
            <img
              src={feature.image}
              alt={feature.title}
              width={feature.width}
              className="max-w-full h-auto rounded-lg shadow-sm hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      ))}

      <div className="text-center mb-0">
        <Link
          to="/home"
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Get Started with Chainvoice
        </Link>
      </div>
    </div>
  )
}
export default Feature