/**
 * Real blockchain token types for Monad chain.
 * Replaces the flat mock Token interface.
 */

export interface Token {
    address: string;        // on-chain contract address
    symbol: string;
    name: string;
    decimals: number;
    chainId: string;        // "monad"
    logoUrl?: string;
}

export interface TradingPair {
    pairAddress: string;    // DEX pool/pair contract address
    baseToken: Token;
    quoteToken: Token;
    dexId: string;          // e.g. "uniswap", "crust"
    priceUsd: string;
    priceNative: string;
    priceChange24h: number;
    volume24h: number;
    liquidity: number;
    fdv?: number;
    url?: string;           // DexScreener URL
}

/**
 * Represents a market entry for the MarketSelector UI.
 * Combines static token info with live market data.
 */
export interface MarketEntry {
    pairAddress: string;
    symbol: string;         // e.g. "WMON/USDC"
    baseSymbol: string;     // e.g. "WMON"
    quoteSymbol: string;    // e.g. "USDC"
    name: string;           // e.g. "Wrapped Monad"
    priceUsd: string;
    priceChange24h: number;
    volume24h: number;
    liquidity: number;
    dexId?: string;
    iconUrl?: string;
}
