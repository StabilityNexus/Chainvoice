import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiShield,
  FiMail,
  FiCode,
  FiTrendingUp,
  FiLock,
  FiZap,
} from "react-icons/fi";
import { SiEthereum } from "react-icons/si";
import { LockIcon } from "lucide-react";
import TokenCarousel from "@/components/TokenCrousel";

function Landing() {
  // useEffect(() => {
  //   // Smooth scroll for anchor links
  //   document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  //     anchor.addEventListener("click", function (e) {
  //       e.preventDefault();
  //       document.querySelector(this.getAttribute("href")).scrollIntoView({
  //         behavior: "smooth",
  //       });
  //     });
  //   });
  // }, []);

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
                End-to-end encrypted, multi-chain invoicing with Lit Protocol
                and support for 1000+ ERC20 tokens.
              </p>

              <div className="flex flex-col space-y-6">
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-full">
                    <img
                      src="/lit-protocol-logo.png"
                      alt="Lit Protocol"
                      className="h-4 w-4"
                    />
                    <span>Lit Protocol Encrypted</span>
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
                  src="/dashboard.png"
                  alt="Secure Invoice Dashboard"
                  className="rounded-xl shadow-2xl border border-gray-700/50"
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg shadow-lg">
                  <div className="bg-black/80 p-3 rounded flex items-center">
                    <img
                      src="/lit-protocol-logo.png"
                      alt="Lit Protocol"
                      className="h-4 mr-2"
                    />
                    <p className="text-xs font-mono">
                      Encrypted with Lit Protocol
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
              <span className="text-green-400">Military-Grade Security</span>{" "}
              Powered by Lit Protocol
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: <FiShield className="w-8 h-8" />,
                title: "Decentralized Encryption",
                description:
                  "Invoice data is encrypted using Lit Protocol's distributed key management system, ensuring no single party can access sensitive information without proper authorization.",
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
                  "Our Lit Protocol integration works seamlessly across all supported chains, maintaining security consistency throughout the ecosystem.",
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
              Accept payments in any ERC20 token while maintaining full
              encryption and security through Lit Protocol
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
                Chainvoice's smart contract architecture automatically handles
                token conversions and verifications, while Lit Protocol ensures
                all payment details remain encrypted until settlement. Our
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
                src="/token-select.png"
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
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center"></div>
        </div>

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

      {/* Footer */}
      <footer className="bg-[#0F1015] border-t border-gray-800/50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <a
                href="https://stability.nexus/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/logo-animated.gif"
                  alt="Stability Nexus"
                  className="h-14"
                />
              </a>
            </div>

            <p className="text-gray-400 text-lg text-center">
              © 2025 Stability Nexus. All rights reserved.
            </p>

            <div className="flex items-center gap-9">
              <a
                href="https://github.com/StabilityNexus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition"
              >
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://x.com/StabilityNexus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
                </svg>
              </a>
              <a
                href="https://discord.com/invite/YzDKeEfWtS"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition"
              >
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/stability-nexus/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition"
              >
                <svg
                  className="h-7 w-7"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.266 2.37 4.266 5.455v6.286zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM6.813 20.452H3.861V9h2.952v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                </svg>
              </a>
              <a
                href="https://t.me/StabilityNexus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition"
              >
                <svg
                  className="h-7 w-7"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.954 4.569c-.148-.64-.692-.948-1.341-.704L1.572 11.91c-.588.227-.583.545-.106.69l5.422 1.694 2.072 6.503c.254.704.138.983.824.983.53 0 .764-.243 1.06-.53l2.56-2.488 5.325 3.93c.98.54 1.687.262 1.932-.907L23.954 4.57zM9.64 15.285l-.323 3.606-1.89-5.89 13.79-7.84-11.577 10.124z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
