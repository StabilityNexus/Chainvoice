import { useState } from "react";

/**
 * Tries `src`, then `fallbackSrc`, then renders `fallback`. Each source is
 * attempted once, so a broken fallback image can't loop on onError.
 */
const ImageWithFallback = ({
  src,
  fallbackSrc,
  fallback = null,
  onError,
  ...props
}) => {
  const [failure, setFailure] = useState({ src: null, count: 0 });
  const failedCount = failure.src === src ? failure.count : 0;

  const candidates = [src, fallbackSrc].filter(
    (candidate, index, list) => candidate && list.indexOf(candidate) === index
  );
  const currentSrc = candidates[failedCount];

  if (!currentSrc) return fallback;

  const handleError = (event) => {
    setFailure((prev) => ({
      src,
      count: (prev.src === src ? prev.count : 0) + 1,
    }));
    onError?.(event);
  };

  return <img {...props} src={currentSrc} onError={handleError} />;
};

export default ImageWithFallback;
