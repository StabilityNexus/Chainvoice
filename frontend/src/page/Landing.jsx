import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { FiShield, FiLock, FiZap } from "react-icons/fi";
import { SiEthereum } from "react-icons/si";
import TokenCarousel from "@/components/TokenCrousel";
import Footer from "@/components/Footer";

function Landing() {
  return (
    <div className="bg-[#0F1015] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-purple-500/10 to-blue-500/10"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl font-bold leading-tight"
              >
                <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                  Web3 Invoicing
                </span>{" "}
                <br />
                Made Simple
              </motion.h1>

              <p className="text-xl text-gray-300 leading-relaxed">
                End-to-end encrypted, multi-chain invoicing
                and support for 1000+ ERC20 tokens.
              </p>

              <div className="flex flex-col space-y-6">
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-full">
                    <FiShield className="text-green-400" />
                    <span>End-to-End Encrypted</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-full">
                    <SiEthereum className="text-green-400" />
                    <span>Multi-chain Support</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-full">
                    <FiLock className="text-green-400" />
                    <span>End-to-End Security</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <img
                  src={`${import.meta.env.BASE_URL}dashboard.png`}
                  alt="Secure Invoice Dashboard"
                  className="rounded-xl shadow-2xl border border-gray-700/50"
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg shadow-lg">
                  <div className="bg-black/80 p-3 rounded flex items-center">
                    <FiShield className="text-green-400 mr-2" />
                    <p className="text-xs font-mono">
                      End-to-End Encrypted
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-gradient-to-b from-[#0F1015] to-[#161920]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-6"
            >
              <span className="text-green-400">Military-Grade Security</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: <FiShield className="w-8 h-8" />,
                title: "Decentralized Encryption",
                description:
                  "Invoice data is encrypted using a distributed key management system, ensuring no single party can access sensitive information without proper authorization.",
              },
              {
                icon: <FiLock className="w-8 h-8" />,
                title: "Conditional Access",
                description:
                  "Define precise access conditions using blockchain parameters. Payments automatically decrypt invoice details when conditions are met.",
              },
              {
                icon: <FiZap className="w-8 h-8" />,
                title: "Cross-Chain Compatibility",
                description:
                  "Our encryption integration works seamlessly across all supported chains, maintaining security consistency throughout the ecosystem.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#1E2029] p-8 rounded-xl border border-gray-800 hover:border-green-400/30 transition-all"
              >
                <div className="bg-green-500/10 w-14 h-14 rounded-lg flex items-center justify-center text-green-400 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Token Support Section */}
      <section className="py-20 bg-[#161920]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-4"
            >
              Universal <span className="text-green-400">Token Support</span>
            </motion.h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              encryption and security
            </p>
          </div>

          <TokenCarousel />

          <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-6"
              >
                Seamless Multi-Token{" "}
                <span className="text-green-400">Payments</span>
              </motion.h3>

              <p className="text-gray-400 mb-6 leading-relaxed">
                Chainvoice&apos;s smart contract architecture automatically handles
                token conversions and verifications, while end-to-end encryption ensures
                all payment details remain secure until settlement. Our
                system supports:
              </p>

              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>All standard ERC20 tokens across EVM chains</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Native chain currencies (ETH, MATIC, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Stablecoins with automatic price feeds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Custom token whitelisting for enterprise clients</span>
                </li>
              </ul>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={`${import.meta.env.BASE_URL}token-select.png`}
                alt="Token Payment Flow"
                className="rounded-xl border border-gray-700/50 shadow-xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-[#1E2029] px-3 py-1.5 rounded-lg border border-gray-700/50 shadow-sm flex gap-3 items-center">
                <span className="text-xs font-bold"> 1000+ ERC20 Token</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#0F1015] relative overflow-hidden border-t border-gray-800/50">


        <div className="container mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Experience{" "}
              <span className="text-green-400">Next-Gen</span> Invoicing?
            </h2>

            <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of Web3-native businesses already using Chainvoice
              for secure, encrypted invoicing with support for all major ERC20
              tokens across multiple chains.
            </p>

            <div className="flex flex-col items-center space-y-6">
              <div className="flex justify-center">
                <ConnectButton
                  showBalance={false}
                  accountStatus="full"
                  chainStatus="full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
