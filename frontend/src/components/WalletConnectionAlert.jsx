// components/WalletConnectionAlert.jsx
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
const WalletConnectionAlert = ({ show, onDismiss }) => {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Optional: backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 z-40"
            onClick={onDismiss}
          />

          {/* Alert box */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="fixed top-10 transform -translate-x-1/2 z-50 w-full max-w-lg mx-4"
          >
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <AccountBalanceWalletIcon
                  className="h-8 w-8 text-yellow-600 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-yellow-800 mb-1">
                    Wallet Connection Required
                  </h3>
                  <p className="text-sm text-yellow-700 mb-3">
                    Connect your wallet to create and manage invoices
                  </p>
                </div>
                {/* Optional close button */}
                <button
                  onClick={onDismiss}
                  className="text-yellow-600 hover:text-yellow-800  transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WalletConnectionAlert;
