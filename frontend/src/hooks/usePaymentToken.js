import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useConfig } from "wagmi";
import { getNativeToken } from "../utils/paymentToken.js";

export function useNativeToken(chainId) {
  const { chains } = useConfig();
  return useMemo(
    () => getNativeToken(chains.find((chain) => chain.id === Number(chainId))),
    [chains, chainId]
  );
}

export function usePaymentToken(chainId) {
  const nativeToken = useNativeToken(chainId);
  const [selectedToken, setSelectedToken] = useState(nativeToken);
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [useCustomToken, setUseCustomToken] = useState(false);
  const [tokenVerificationState, setTokenVerificationState] = useState("idle");
  const [verifiedToken, setVerifiedToken] = useState(null);
  const request = useRef({ chainId, id: 0 });
  request.current.chainId = chainId;

  useEffect(() => {
    request.current.id += 1;
    setSelectedToken(nativeToken);
    setCustomTokenAddress("");
    setUseCustomToken(false);
    setVerifiedToken(null);
    setTokenVerificationState("idle");
  }, [nativeToken, chainId]);

  // Discard metadata reads superseded by another selection or network change.
  const beginTokenRequest = useCallback(() => {
    const id = ++request.current.id;
    return () => request.current.chainId === chainId && request.current.id === id;
  }, [chainId]);

  return {
    nativeToken,
    selectedToken, setSelectedToken,
    customTokenAddress, setCustomTokenAddress,
    useCustomToken, setUseCustomToken,
    tokenVerificationState, setTokenVerificationState,
    verifiedToken, setVerifiedToken,
    beginTokenRequest,
  };
}
