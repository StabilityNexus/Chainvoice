import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SiEthereum } from "react-icons/si";
import { TOKEN_PRESETS } from "@/utils/erc20_token";

const TokenCarousel = () => {
  const carouselRef = useRef();
  const duplicatedTokens = [...TOKEN_PRESETS, ...TOKEN_PRESETS]; // Double the tokens for seamless loop

  useEffect(() => {
    const carousel = carouselRef.current;
    let animationFrame;
    let speed = 1; // Pixels per frame
    let position = 0;

    const animate = () => {
      position -= speed;
      if (position <= -carousel.scrollWidth / 2) {
        position = 0;
      }
      carousel.style.transform = `translateX(${position}px)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // Pause on hover
    const pause = () => cancelAnimationFrame(animationFrame);
    const resume = () => {
      cancelAnimationFrame(animationFrame);
      animate();
    };

    carousel.addEventListener("mouseenter", pause);
    carousel.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(animationFrame);
      carousel.removeEventListener("mouseenter", pause);
      carousel.removeEventListener("mouseleave", resume);
    };
  }, []);

  return (
    <div className="relative overflow-hidden py-6">
      <div className="whitespace-nowrap">
        <motion.div ref={carouselRef} className="inline-flex gap-4">
          {duplicatedTokens.map((token, index) => (
            <motion.div
              key={`${token.address}-${index}`}
              whileHover={{ scale: 1.05 }}
              className="inline-flex bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-green-400/30 transition-all"
            >
              <div className="flex items-center space-x-3 w-[180px]">
                <div className="relative">
                  <img
                    src={token.logo}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full object-contain"
                    onError={(e) => {
                      e.target.src = "/tokenImages/default.png";
                    }}
                  />
                  {token.address ===
                    "0x0000000000000000000000000000000000000000" && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                      <SiEthereum className="text-white text-xs" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{token.symbol}</h4>
                  <p className="text-xs text-gray-400">{token.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TokenCarousel;
