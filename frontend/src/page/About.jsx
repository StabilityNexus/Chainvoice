import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiShield,
  FiZap,
  FiGlobe,
  FiCode,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiArrowRight,
  FiTerminal,
  FiCheckCircle,
  FiPlus,
  FiCreditCard,
  FiCpu,
  FiArrowUp,
} from "react-icons/fi";

function About() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    const fetchContributors = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/StabilityNexus/Chainvoice/contributors"
        );
        if (response.ok) {
          const data = await response.json();
          setContributors(data);
        } else {
          console.error("Failed to fetch contributors");
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching contributors:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const features = [
    {
      icon: <FiShield className="w-8 h-8 text-green-400" />,
      title: "Decentralized & Secure",
      description:
        "Your financial data is stored on the blockchain, ensuring immutability and resistance to censorship.",
    },
    {
      icon: <FiZap className="w-8 h-8 text-green-400" />,
      title: "Instant Settlements",
      description:
        "Bypass traditional banking delays. Payments are processed in seconds directly to your wallet.",
    },
    {
      icon: <FiGlobe className="w-8 h-8 text-green-400" />,
      title: "Global Reach",
      description:
        "Send and receive invoices anywhere in the world without worrying about currency conversion fees or borders.",
    },
    {
      icon: <FiCode className="w-8 h-8 text-green-400" />,
      title: "Smart Invoicing",
      description:
        "Automated logic via smart contracts ensures correct payment amounts and transparent transaction history.",
    },
  ];

  const steps = [
    {
      icon: <FiCreditCard className="w-6 h-6 text-white" />,
      title: "Connect Wallet",
      desc: "Sign in with any supported wallet.",
    },
    {
      icon: <FiTerminal className="w-6 h-6 text-white" />,
      title: "Create Invoice",
      desc: "Generate smart invoices with set terms.",
    },
    {
      icon: <FiCheckCircle className="w-6 h-6 text-white" />,
      title: "Get Paid",
      desc: "Receive crypto directly to your address.",
    },
  ];

  const SkeletonLoader = () => (
    <div className="flex flex-wrap justify-center gap-12 animate-pulse">
      {[1, 2, 3].map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-800 border-4 border-gray-700 mb-6"></div>
          <div className="h-6 w-24 bg-gray-800 rounded mb-2"></div>
          <div className="h-4 w-16 bg-gray-800 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#0F1015] text-white min-h-screen font-Montserrat">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-purple-500/10 to-blue-500/10"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            Powering the <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              Decentralized Economy
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-8"
          >
            We are building more than just an invoicing tool. <br />
            Chainvoice is the financial operating system for Web3, <br />
            enabling permissionless commerce for everyone.
          </motion.p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 border-b border-gray-800/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }} // Staggered delay after Hero
                className="flex flex-col items-center text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 rounded-full bg-[#1E2029] border border-gray-700 flex items-center justify-center mb-4 group-hover:border-green-500 transition-colors cursor-default"
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 bg-[#161920]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Chainvoice?</h2>
            <div className="h-1 w-20 bg-green-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-[#1E2029] p-8 rounded-xl border border-gray-800 hover:border-green-400/30 transition-all"
              >
                <div className="bg-gray-900 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Under the Hood - Code Visual */}
      <section className="py-24 bg-[#0F1015] border-t border-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="flex items-center space-x-2 text-green-400 mb-6">
                <FiTerminal className="w-6 h-6" />
                <span className="font-mono text-sm uppercase tracking-wide">
                  Under the Hood
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Transparent Logic.
                <br />
                Auditable Security.
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Chainvoice isn't a black box. Our core logic runs publicly on
                blockchains and is verifiable by anyone.
              </p>
              <a
                href="https://github.com/StabilityNexus/Chainvoice"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-green-400 font-semibold hover:text-green-300 transition-colors"
              >
                View Contracts on GitHub <FiArrowRight className="ml-2" />
              </a>
            </div>

            {/* Mobile View: Simple Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full md:hidden bg-[#1E2029] p-6 rounded-xl border border-gray-800 flex flex-col items-center text-center"
            >
              <FiShield className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Verified Contract</h3>
              <p className="text-gray-400 text-sm mb-4">
                The Chainvoice smart contracts are fully open-source and
                auditable.
              </p>
              <div className="px-4 py-2 bg-black/30 rounded font-mono text-xs text-green-400 break-all">
                0x...ContractAddress
              </div>
            </motion.div>

            {/* Desktop View: Full Code Block */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden md:block flex-1 w-full max-w-lg bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-gray-800 font-mono text-xs md:text-sm"
            >
              <div className="flex items-center px-4 py-3 bg-[#252526] border-b border-gray-800">
                <div className="flex space-x-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-gray-500">Invoice.sol</span>
              </div>
              <div className="p-6 space-y-2 text-[#d4d4d4]">
                <p>
                  <span className="text-[#C586C0]">function</span>{" "}
                  <span className="text-[#DCDCAA]">createInvoice</span>(
                </p>
                <p className="pl-4">
                  <span className="text-[#4EC9B0]">address</span>{" "}
                  <span className="text-[#9CDCFE]">_recipient</span>,
                </p>
                <p className="pl-4">
                  <span className="text-[#4EC9B0]">uint256</span>{" "}
                  <span className="text-[#9CDCFE]">_amount</span>,
                </p>
                <p className="pl-4">
                  <span className="text-[#4EC9B0]">string</span>{" "}
                  <span className="text-[#C586C0]">memory</span>{" "}
                  <span className="text-[#9CDCFE]">_metadata</span>
                </p>
                <p>
                  ) <span className="text-[#C586C0]">public</span>{" "}
                  <span className="text-[#C586C0]">returns</span> (
                  <span className="text-[#4EC9B0]">uint256</span>) {"{"}
                </p>
                <p className="pl-4 text-[#6A9955]">// Verify inputs</p>
                <p className="pl-4">
                  <span className="text-[#DCDCAA]">require</span>(_amount {">"}{" "}
                  <span className="text-[#B5CEA8]">0</span>,{" "}
                  <span className="text-[#CE9178]">"Invalid amount"</span>);
                </p>
                <p className="pl-4">
                  <span className="text-[#DCDCAA]">require</span>(_recipient !=
                  <span className="text-[#4EC9B0]">address</span>(
                  <span className="text-[#B5CEA8]">0</span>),{" "}
                  <span className="text-[#CE9178]">"Invalid address"</span>);
                </p>
                <p className="pl-4">&nbsp;</p>
                <p className="pl-4 text-[#6A9955]">
                  // Emit event for indexers
                </p>
                <p className="pl-4">
                  <span className="text-[#C586C0]">emit</span>{" "}
                  <span className="text-[#4EC9B0]">InvoiceCreated</span>
                  (msg.<span className="text-[#9CDCFE]">sender</span>,
                  _recipient, _amount);
                </p>
                <p className="pl-4">&nbsp;</p>
                <p className="pl-4">
                  <span className="text-[#C586C0]">return</span> invoiceId;
                </p>
                <p>{"}"}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-[#161920]">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold mb-4"
          >
            Meet the <span className="text-green-400">Builders</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-16">
            The talented developers and designers building Chainvoice.
          </p>

          {loading ? (
            <SkeletonLoader />
          ) : error ? (
            <div className="text-gray-400">
              <p className="mb-4">
                Unable to load contributors directly (GitHub API rate limit).
              </p>
              <a
                href="https://github.com/StabilityNexus/Chainvoice/graphs/contributors"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 border border-green-500 text-green-400 rounded-full hover:bg-green-500 hover:text-white transition-colors"
              >
                View Contributors on GitHub
              </a>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-12">
              {contributors.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-green-500 transition-colors duration-300">
                    <img
                      src={member.avatar_url}
                      alt={member.login}
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {member.login || "Contributor"}
                  </h3>
                  <div className="flex justify-center space-x-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <a
                      href={member.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <FiGithub size={20} />
                    </a>
                  </div>
                </motion.div>
              ))}
              {/* Join Us Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group flex flex-col items-center"
              >
                <a
                  href="https://discord.com/invite/YzDKeEfWtS"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full border-4 border-dashed border-gray-700 flex items-center justify-center text-gray-500 group-hover:text-green-400 group-hover:border-green-500 transition-all cursor-pointer">
                    <FiPlus size={40} />
                  </div>
                </a>
                <h3 className="text-xl font-bold text-white mb-1">You?</h3>
                <p className="text-green-400 text-sm">Join the Team</p>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-20 bg-[#0F1015] border-t border-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="bg-[#1E2029] rounded-2xl p-8 md:p-16 text-center border border-gray-800 hover:border-green-500/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to shape the future?
              </h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Join our community of developers, creators, and web3
                enthusiasts. Contributions are always welcome.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="https://discord.com/invite/YzDKeEfWtS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Join Discord
                </a>
                <a
                  href="https://github.com/StabilityNexus/Chainvoice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-[#1E2029] hover:bg-[#2A2D3A] text-white border border-gray-700 rounded-lg font-bold transition-transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FiGithub /> Star on GitHub
                </a>
              </div>
            </div>
          </div>
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
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-8 z-50 p-4 bg-green-600 hover:bg-green-500 text-white rounded-full shadow-lg transition-colors"
          >
            <FiArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default About;
