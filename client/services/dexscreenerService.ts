import { MarketEntry } from '../types/token';

const BASE_URL = 'https://api.dexscreener.com';

/**
 * Raw pair data shape from DexScreener API responses.
 */
interface DexScreenerPair {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    baseToken: {
        address: string;
        name: string;
        symbol: string;
    };
    quoteToken: {
        address: string;
        name: string;
        symbol: string;
    };
    priceNative: string;
    priceUsd: string;
    txns: {
        h24: { buys: number; sells: number };
    };
    volume: {
        h24: number;
    };
    priceChange: {
        h24: number;
    };
    liquidity: {
        usd: number;
    };
    fdv: number;
    info?: {
        header?: string;
        imageUrl?: string;
        websites?: { label: string; url: string }[];
        socials?: { type: string; url: string }[];
    };
}

interface DexScreenerResponse {
    schemaVersion: string;
    pairs: DexScreenerPair[] | null;
}

/**
 * dexscreenerService
 *
 * Wraps all DexScreener API calls for Monad chain data.
 * No API key required. Rate limit: 300 req/min.
 */
export const dexscreenerService = {
    /**
     * Get all trading pairs for a token address on a given chain.
     */
    async getPairsByToken(chainId: string, tokenAddress: string): Promise<DexScreenerPair[]> {
        try {
            const res = await fetch(
                `${BASE_URL}/token-pairs/v1/${chainId}/${tokenAddress}`,
                { next: { revalidate: 10 } }
            );
            if (!res.ok) throw new Error(`DexScreener API error: ${res.status}`);
            const data: DexScreenerPair[] = await res.json();
            return data || [];
        } catch (e) {
            console.error('DexScreener getPairsByToken failed:', e);
            return [];
        }
    },

    /**
     * Get a specific pair by chain and pair address.
     */
    async getPairByAddress(chainId: string, pairAddress: string): Promise<DexScreenerPair | null> {
        try {
            const res = await fetch(
                `${BASE_URL}/latest/dex/pairs/${chainId}/${pairAddress}`
            );
            if (!res.ok) throw new Error(`DexScreener API error: ${res.status}`);
            const data: DexScreenerResponse = await res.json();
            return data.pairs?.[0] || null;
        } catch (e) {
            console.error('DexScreener getPairByAddress failed:', e);
            return null;
        }
    },

    /**
     * Search for pairs matching a query string (e.g. "WMON" or "MON/USDC").
     * Optionally filter by chain.
     */
    async searchPairs(query: string, chainId?: string): Promise<DexScreenerPair[]> {
        try {
            const res = await fetch(
                `${BASE_URL}/latest/dex/search?q=${encodeURIComponent(query)}`
            );
            if (!res.ok) throw new Error(`DexScreener API error: ${res.status}`);
            const data: DexScreenerResponse = await res.json();
            let pairs = data.pairs || [];

            // Filter by chain if specified
            if (chainId) {
                pairs = pairs.filter(p => p.chainId === chainId);
            }

            return pairs;
        } catch (e) {
            console.error('DexScreener searchPairs failed:', e);
            return [];
        }
    },

    /**
     * Get pairs for a token and convert to MarketEntry format for the UI.
     * Sorted by liquidity (highest first), limited to top N.
     */
    async getMarketsForToken(chainId: string, tokenAddress: string, limit = 10): Promise<MarketEntry[]> {
        const pairs = await this.getPairsByToken(chainId, tokenAddress);

        return pairs
            .filter(p => p.liquidity?.usd > 0)
            .sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))
            .slice(0, limit)
            .map(p => ({
                pairAddress: p.pairAddress,
                symbol: `${p.baseToken.symbol}/${p.quoteToken.symbol}`,
                baseSymbol: p.baseToken.symbol,
                quoteSymbol: p.quoteToken.symbol,
                name: p.baseToken.name,
                priceUsd: p.priceUsd || '0',
                priceChange24h: p.priceChange?.h24 || 0,
                volume24h: p.volume?.h24 || 0,
                liquidity: p.liquidity?.usd || 0,
                dexId: p.dexId,
                iconUrl: p.info?.imageUrl,
            }));
    },

    /**
     * Fetch trending pairs for a chain by running multiple search queries.
     * This discovers a broad range of tokens (meme coins, DEX tokens, wrapped assets, LSTs, etc.)
     * matching what DexScreener's trending page shows.
     */
    async getTrendingPairs(chainId: string, limit = 50): Promise<MarketEntry[]> {
        // Run multiple searches in parallel to discover diverse tokens
        const searchQueries = [
            'MON', 'CHOG', 'DUST', 'MONSHI', 'LV', 'emonad',
            'moncock', 'shramp', 'MONIKA', 'NADS', 'PEPE',
            'APR', 'gMON', 'shMON', 'WETH', 'WBTC', 'USDC',
            'TCG', 'UNIT', 'ALLOCA', 'KOL', 'MONA',
        ];

        try {
            const results = await Promise.allSettled(
                searchQueries.map(q => this.searchPairs(q, chainId))
            );

            const allPairs: DexScreenerPair[] = [];
            for (const result of results) {
                if (result.status === 'fulfilled') {
                    allPairs.push(...result.value);
                }
            }

            // Deduplicate by pairAddress
            const seen = new Set<string>();
            const uniquePairs = allPairs.filter(p => {
                if (seen.has(p.pairAddress)) return false;
                seen.add(p.pairAddress);
                return true;
            });

            // Sort by 24h transaction count (trending), then by volume
            return uniquePairs
                .filter(p => parseFloat(p.priceUsd || '0') > 0)
                .sort((a, b) => {
                    const txA = (a.txns?.h24?.buys || 0) + (a.txns?.h24?.sells || 0);
                    const txB = (b.txns?.h24?.buys || 0) + (b.txns?.h24?.sells || 0);
                    if (txB !== txA) return txB - txA;
                    return (b.volume?.h24 || 0) - (a.volume?.h24 || 0);
                })
                .slice(0, limit)
                .map(p => ({
                    pairAddress: p.pairAddress,
                    symbol: `${p.baseToken.symbol}/${p.quoteToken.symbol}`,
                    baseSymbol: p.baseToken.symbol,
                    quoteSymbol: p.quoteToken.symbol,
                    name: p.baseToken.name,
                    priceUsd: p.priceUsd || '0',
                    priceChange24h: p.priceChange?.h24 || 0,
                    volume24h: p.volume?.h24 || 0,
                    liquidity: p.liquidity?.usd || 0,
                    dexId: p.dexId,
                    iconUrl: p.info?.imageUrl,
                }));
        } catch (e) {
            console.error('DexScreener getTrendingPairs failed:', e);
            return [];
        }
    },

    /**
     * Fetch the latest price for a pair. Returns null if unavailable.
     */
    async getLatestPrice(chainId: string, pairAddress: string): Promise<{ price: number; volume24h: number } | null> {
        const pair = await this.getPairByAddress(chainId, pairAddress);
        if (!pair) return null;

        return {
            price: parseFloat(pair.priceUsd) || 0,
            volume24h: pair.volume?.h24 || 0,
        };
    },
};
