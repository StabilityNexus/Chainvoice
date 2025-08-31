const Avatar = ({ src, alt, className = "", children, onError }) => (
  <div
    className={`inline-flex items-center justify-center rounded-full bg-gray-100 overflow-hidden ${className}`}
  >
    {src ? (
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-full"
        onError={onError}
      />
    ) : (
      <div className="flex items-center justify-center w-full h-full text-xs font-medium text-gray-600">
        {children}
      </div>
    )}
  </div>
);
export {Avatar}