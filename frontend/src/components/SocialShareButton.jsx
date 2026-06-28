import React, { useRef, useEffect } from 'react';

const SocialShareButton = (props) => {
  const containerRef = useRef(null);
  const shareButtonRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.SocialShareButton) {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const shareUrl = props.url || (isLocalhost ? 'https://chainvoice.stability.nexus/' : window.location.href);
      
      shareButtonRef.current = new window.SocialShareButton({
        container: containerRef.current,
        url: shareUrl,
        title: props.title || document.title,
        ...props
      });
    }

    return () => {
      if (shareButtonRef.current) {
        shareButtonRef.current.destroy();
        shareButtonRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className={props.customClass || ''}></div>;
};

export default SocialShareButton;
