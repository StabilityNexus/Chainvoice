const Badge = ({ className = "", children }) => (
  <span
    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ${className}`}
  >
    {children}
  </span>
);

export {Badge}