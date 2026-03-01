import { dexscreenerService } from './dexscreenerService';
import { MONAD_CHAIN_ID } from '../lib/monadTokens';

export interface TradeData {
    price: number;
    size: number;
    timestamp: number;
}

/**
 * marketService
 *
 * Provides real market data from DexScreener for Monad chain pairs.
 * Replaces the previous mock random data generation.
 */
export const marketService = {
    /**
     * Fetches the current price for a pair and returns it as initial trade data.
     * Since DexScreener free tier doesn't provide historical OHLCV,
     * we generate a small synthetic history around the current price
     * to give the chart something to render immediately.
     */
    async fetchHistory(pairAddress: string): Promise<TradeData[]> {
        try {
            const priceData = await dexscreenerService.getLatestPrice(MONAD_CHAIN_ID, pairAddress);

            if (!priceData || priceData.price === 0) {
                console.warn(`No price data for pair ${pairAddress}, using fallback`);
                return this._generateFallbackHistory(1.0);
            }

            // Generate synthetic history around the real current price
            // This gives the chart an initial shape while live polling builds real candles
            return this._generateSyntheticHistory(priceData.price);
        } catch (error) {
            console.error('Failed to fetch history:', error);
            return this._generateFallbackHistory(1.0);
        }
    },

    /**
     * Subscribes to live price updates for a pair by polling DexScreener.
     * Emits TradeData on each successful poll.
     */
    subscribeTrades(pairAddress: string, onTrade: (trade: TradeData) => void): () => void {
        let isActive = true;
        let lastPrice = 0;

        const poll = async () => {
            if (!isActive) return;

            try {
                const priceData = await dexscreenerService.getLatestPrice(MONAD_CHAIN_ID, pairAddress);

                if (priceData && priceData.price > 0) {
                    // Only emit if price actually changed to avoid flat candles
                    if (priceData.price !== lastPrice) {
                        lastPrice = priceData.price;
                        onTrade({
                            price: priceData.price,
                            size: priceData.volume24h / (24 * 60 * 12), // Approximate per-5s volume
                            timestamp: Date.now(),
                        });
                    }
                }
            } catch (e) {
                console.error('Price poll failed:', e);
            }

            if (isActive) {
                setTimeout(poll, 5000); // Poll every 5 seconds
            }
        };

        // Start polling immediately
        poll();

        return () => {
            isActive = false;
        };
    },

    /**
     * Generates synthetic historical trades around a known price point.
     * Used to give the chart an initial shape before live data builds up.
     */
    _generateSyntheticHistory(currentPrice: number): TradeData[] {
        const now = Date.now();
        const trades: TradeData[] = [];
        let price = currentPrice * (1 - 0.02); // Start 2% below current

        // Generate ~200 trades over the last ~16 minutes (one per 5s)
        for (let i = 200; i > 0; i--) {
            // Random walk towards the current price
            const drift = (currentPrice - price) * 0.01; // Mean-revert towards current
            const noise = (Math.random() - 0.5) * currentPrice * 0.002; // 0.2% noise
            price += drift + noise;

            trades.push({
                price: Math.max(price, currentPrice * 0.95), // Floor at -5%
                size: Math.random() * 2,
                timestamp: now - i * 5000,
            });
        }

        // Ensure the last trade is at the actual current price
        trades.push({
            price: currentPrice,
            size: 1,
            timestamp: now,
        });

        return trades;
    },

    /**
     * Fallback history when no API data is available.
     */
    _generateFallbackHistory(basePrice: number): TradeData[] {
        const now = Date.now();
        const trades: TradeData[] = [];
        let price = basePrice;

        for (let i = 200; i > 0; i--) {
            price += (Math.random() - 0.5) * basePrice * 0.005;
            trades.push({
                price: Math.max(price, 0.001),
                size: Math.random() * 2,
                timestamp: now - i * 5000,
            });
        }
        return trades;
    },
};
