import { EthereumProvider } from './provider';
/**
 * Infers whether the address might be a ProxyAdmin contract, by checking if it has an owner() function that returns an address.
 * @param provider Ethereum provider
 * @param possibleContractAddress The address to check
 * @returns true if the address might be a ProxyAdmin contract, false otherwise
 */
export declare function inferProxyAdmin(provider: EthereumProvider, possibleContractAddress: string): Promise<boolean>;
//# sourceMappingURL=infer-proxy-admin.d.ts.map