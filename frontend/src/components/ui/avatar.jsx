import ImageWithFallback from "../ImageWithFallback";

const Avatar = ({ src, fallbackSrc, alt, className = "", children }) => (
  <div
    className={`inline-flex items-center justify-center rounded-full bg-gray-100 overflow-hidden ${className}`}
  >
    <ImageWithFallback
      src={src}
      fallbackSrc={fallbackSrc}
      alt={alt}
      className="w-full h-full object-cover rounded-full"
      fallback={
        <div className="flex items-center justify-center w-full h-full text-xs font-medium text-gray-600">
          {children}
        </div>
      }
    />
  </div>
);
export {Avatar}