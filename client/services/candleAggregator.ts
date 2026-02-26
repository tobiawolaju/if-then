import { TradeData } from './marketService';

export interface CandleData {
    time: number; // unix timestamp in seconds
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export type Timeframe = '1s' | '1m' | '5m' | '15m';

const TIMEFRAME_MAP: Record<Timeframe, number> = {
    '1s': 1,
    '1m': 60,
    '5m': 300,
    '15m': 900,
};

/**
 * candleAggregator
 *
 * Logic for grouping raw trades into OHLCV buckets.
 */
export class CandleAggregator {
    /**
     * Groups a set of trades into candles based on the timeframe.
     */
    static buildHistoricalCandles(trades: TradeData[], timeframe: Timeframe): CandleData[] {
        if (trades.length === 0) return [];

        const interval = TIMEFRAME_MAP[timeframe];
        const candles: Map<number, CandleData> = new Map();

        // Process in chronological order
        const sortedTrades = [...trades].sort((a, b) => a.timestamp - b.timestamp);

        for (const trade of sortedTrades) {
            const bucketTime = Math.floor(trade.timestamp / 1000 / interval) * interval;

            if (!candles.has(bucketTime)) {
                candles.set(bucketTime, {
                    time: bucketTime,
                    open: trade.price,
                    high: trade.price,
                    low: trade.price,
                    close: trade.price,
                    volume: trade.size,
                });
            } else {
                const candle = candles.get(bucketTime)!;
                candle.high = Math.max(candle.high, trade.price);
                candle.low = Math.min(candle.low, trade.price);
                candle.close = trade.price;
                candle.volume += trade.size;
            }
        }

        return Array.from(candles.values()).sort((a, b) => a.time - b.time);
    }

    /**
     * Updates an existing candle or creates a new one based on a single incoming trade.
     */
    static updateCurrentCandle(lastCandle: CandleData | null, trade: TradeData, timeframe: Timeframe): { candle: CandleData, isNew: boolean } {
        const interval = TIMEFRAME_MAP[timeframe];
        const bucketTime = Math.floor(trade.timestamp / 1000 / interval) * interval;

        if (!lastCandle || bucketTime > lastCandle.time) {
            // New candle bucket started
            return {
                candle: {
                    time: bucketTime,
                    open: trade.price,
                    high: trade.price,
                    low: trade.price,
                    close: trade.price,
                    volume: trade.size,
                },
                isNew: true
            };
        }

        // Update current candle
        return {
            candle: {
                ...lastCandle,
                high: Math.max(lastCandle.high, trade.price),
                low: Math.min(lastCandle.low, trade.price),
                close: trade.price,
                volume: lastCandle.volume + trade.size,
            },
            isNew: false
        };
    }
}
