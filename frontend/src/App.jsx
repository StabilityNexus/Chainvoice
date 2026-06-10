import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import * as chains from "wagmi/chains";
import { mainnet, classic, base, bsc, polygon, sepolia } from "wagmi/chains";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import { lazy, Suspense } from "react";
import Landing from "./page/Landing";
import Applayout from "./page/Applayout";
import { citreaTestnet } from "./utils/CitreaTestnet";

const Home = lazy(() => import("./page/Home"));
const Feature = lazy(() => import("./page/Feature"));
const About = lazy(() => import("./page/About"));
const Working = lazy(() => import("./page/Working"));
const Treasure = lazy(() => import("./page/Treasure"));
const CreateInvoice = lazy(() => import("./page/CreateInvoice"));
const SentInvoice = lazy(() => import("./page/SentInvoice"));
const ReceivedInvoice = lazy(() => import("./page/ReceivedInvoice"));

const AllChains = [mainnet, classic, base, bsc, polygon, sepolia, citreaTestnet];

export const config = getDefaultConfig({
  appName: "Chainvoice",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: AllChains,
  ssr: false,
});
const queryClient = new QueryClient();
import { Toaster } from "react-hot-toast";
const GenerateLink = lazy(() => import("./page/GenerateLink"));
const CreateInvoicesBatch = lazy(() => import("./page/CreateInvoicesBatch"));
const BatchPayment = lazy(() => import("./page/BatchPayment"));
const NotFound = lazy(() => import("./page/NotFound"));

function App() {
  return (
    <div className="bg-[#161920]">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            coolMode
            // initialChain={citreaTestnet} 
            // Keep this commented out or removed. 
            // If undefined, RainbowKit defaults to the user's current chain (if supported).
            theme={darkTheme({
              accentColor: "#22c55e",
              accentColorForeground: "white",
              borderRadius: "medium",
              fontStack: "system",
              overlayBlur: "small",
            })}
          >
            <div className="font-Montserrat h-screen">
              <Router basename={import.meta.env.BASE_URL}>
                <Suspense fallback={<div className="flex h-screen items-center justify-center text-white">Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<Applayout />}>
                      <Route index element={<Landing />} />
                      <Route path="dashboard" element={<Home />}>
                        <Route path="create" element={<CreateInvoice />} />
                        <Route path="sent" element={<SentInvoice />} />
                        <Route path="pending" element={<ReceivedInvoice />} />
                        <Route path="generate-link" element={<GenerateLink />} />
                        <Route
                          path="batch-invoice"
                          element={<CreateInvoicesBatch />}
                        />
                      </Route>
                      <Route path="feature" element={<Feature />} />
                      <Route path="about" element={<About />} />
                      <Route path="working" element={<Working />} />
                      <Route path="treasure" element={<Treasure />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </Suspense>
              </Router>
            </div>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}

export default App;
