import { Token, MarketEntry } from '../types/token';

/**
 * Monad Chain Configuration
 */
export const MONAD_CHAIN_ID = 'monad';

/**
 * Core Monad Token Registry
 * Real contract addresses on Monad mainnet.
 */
export const MONAD_TOKENS: Record<string, Token> = {
    WMON: {
        address: '0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A',
        symbol: 'WMON',
        name: 'Wrapped Monad',
        decimals: 18,
        chainId: MONAD_CHAIN_ID,
    },
    USDC: {
        address: '0x754704Bc059F8C67012fEd69BC8A327a5aafb603',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        chainId: MONAD_CHAIN_ID,
    },
};

/**
 * Default pair addresses to display in the MarketSelector.
 * These are fetched from DexScreener at runtime for live data.
 * The token addresses here are used to discover pairs via the API.
 */
export const DEFAULT_TOKEN_ADDRESSES: string[] = [
    MONAD_TOKENS.WMON.address,
];

/**
 * Fallback market entries for when the API hasn't loaded yet.
 * These are replaced by live data once DexScreener responds.
 */
export const FALLBACK_MARKETS: MarketEntry[] = [
    {
        pairAddress: '',
        symbol: 'WMON/USDC',
        baseSymbol: 'WMON',
        quoteSymbol: 'USDC',
        name: 'Wrapped Monad',
        priceUsd: '—',
        priceChange24h: 0,
        volume24h: 0,
        liquidity: 0,
    },
];
