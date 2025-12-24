// Updated Navbar.js
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

function Navbar() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasConnected, setHasConnected] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Improved active route detection
  const isActive = (path) => {
    if (path.startsWith("/#")) {
      return location.pathname === "/" && location.hash === path.substring(1);
    }
    return (
      location.pathname.startsWith(path) &&
      (path !== "/" || location.pathname === "/")
    );
  };

  useEffect(() => {
    if (address && !hasConnected && location.pathname === "/") {
      navigate("/dashboard/create");
      setHasConnected(true);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isConnected, hasConnected, navigate, location.pathname]);

  const handleScroll = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          window.scrollTo({
            top: section.offsetTop - 200,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 200,
          behavior: "smooth",
        });
      }
    }
  };

  // const navItems = [
    // {
    //   name: "Home",
    //   icon: <HomeIcon className="text-current" />,
    //   action: () => handleScroll("home-section"),
    //   path: "/",
    // },
    // {
    //   name: "Features",
    //   icon: <FeaturedPlayListIcon className="text-current" />,
    //   action: () => handleScroll("feature-section"),
    //   path: "/#feature-section",
    // },
    // {
    //   name: "Services",
    //   icon: <DesignServicesIcon className="text-current" />,
    //   action: () => handleScroll("service-section"),
    //   path: "/#service-section",
    // },
  // ];

  const appItems = [
    {
      name: "Home",
      icon: <HomeIcon className="text-current" />,
      action: () => handleScroll("home-section"),
      path: "/",
    },
    {
      name: "Dashboard",
      icon: <DashboardIcon className="text-current" />,
      path: "/dashboard",
      activePaths: [
        "/dashboard/create",
        "/dashboard/sent",
        "/dashboard/pending",
      ],
    },
    {
      name: "Treasure",
      icon: <AccountBalanceWalletIcon className="text-current" />,
      path: "/treasure",
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#161920]/85 backdrop-blur-md shadow-xl"
          : "bg-[#161920]"
      }`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex justify-between items-center h-24">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => {
              navigate("/");
              closeMobileMenu();
            }}
          >
            <img src="/logo.png" alt="logo" width={50} />
            <p className="text-3xl font-bold text-green-500">
              Cha<span className="text-3xl font-bold text-white">in</span>voice
            </p>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {/* {navItems.map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={item.action}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "text-green-400 font-medium"
                    : "text-white hover:text-green-400"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </motion.button>
            ))} */}
            {isConnected &&
              appItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item?.path === "/dashboard" ? (
                    <Link
                      to="/dashboard/create"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? "text-green-400 font-medium"
                          : "text-white hover:text-green-400"
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </Link>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? "text-green-400 font-medium"
                          : "text-white hover:text-green-400"
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </Link>
                  )}
                </motion.div>
              ))}

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-4"
            >
              <ConnectButton
                accountStatus="address"
                chainStatus="none"
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
                label="Connect Wallet"
              />
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {/* <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mr-4"
            >
              <ConnectButton
                accountStatus="avatar"
                chainStatus="none"
                showBalance={false}
              />
            </motion.div> */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-2 pb-4 space-y-2">
                {/* Navigation Links */}
                {/* {navItems.map((item) => (
                  <motion.button
                    key={`mobile-${item.name}`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      item.action();
                      closeMobileMenu();
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-green-900/30 text-green-400 font-medium"
                        : "text-white hover:bg-gray-800"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </motion.button>
                ))} */}
                {isConnected &&
                  appItems.map((item) => (
                    <Link
                      key={`mobile-app-${item.name}`}
                      to={item.path === "/dashboard" ? "/dashboard/create" : item.path}
                      onClick={closeMobileMenu}
                      className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? "bg-green-900/30 text-green-400 font-medium"
                          : "text-white hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                      </div>
                    </Link>
                  ))}

                <div className="px-4 py-2">
                  <ConnectButton
                    accountStatus="full"
                    chainStatus="none"
                    showBalance={false}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Navbar;