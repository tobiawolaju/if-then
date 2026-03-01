import { useState, useEffect, useCallback, useRef } from 'react';
import { marketService, TradeData } from '../services/marketService';
import { CandleData, CandleAggregator, Timeframe } from '../services/candleAggregator';

/**
 * useMarketData
 * 
 * Custom hook to manage the lifecycle of market data for the trading chart.
 * Now accepts a pairAddress (DexScreener pair) instead of a generic marketId.
 */
export function useMarketData(pairAddress: string, timeframe: Timeframe) {
    const [candles, setCandles] = useState<CandleData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);

    // Store the latest candle in a ref for the live update logic
    const lastCandleRef = useRef<CandleData | null>(null);

    // Callback for the chart to subscribe to live candle updates
    const onCandleUpdateRef = useRef<((candle: CandleData) => void) | null>(null);

    const loadHistoricalData = useCallback(async () => {
        if (!pairAddress) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const trades = await marketService.fetchHistory(pairAddress);
            const historicalCandles = CandleAggregator.buildHistoricalCandles(trades, timeframe);

            setCandles(historicalCandles);
            if (historicalCandles.length > 0) {
                lastCandleRef.current = historicalCandles[historicalCandles.length - 1];
                setCurrentPrice(lastCandleRef.current.close);
            }
        } catch (error) {
            console.error('Failed to load historical data:', error);
        } finally {
            setLoading(false);
        }
    }, [pairAddress, timeframe]);

    useEffect(() => {
        if (!pairAddress) return;

        loadHistoricalData();

        const unsubscribe = marketService.subscribeTrades(pairAddress, (trade: TradeData) => {
            // 1. Calculate the update
            const { candle, isNew } = CandleAggregator.updateCurrentCandle(
                lastCandleRef.current,
                trade,
                timeframe
            );

            // 2. Update local state for ticker/UI
            setCurrentPrice(trade.price);
            lastCandleRef.current = candle;

            // 3. Emit update to the chart (imperative)
            if (onCandleUpdateRef.current) {
                onCandleUpdateRef.current(candle);
            }

            // 4. Update the historical candles array only if a NEW bucket started
            // This minimizes re-renders of the entire chart data
            if (isNew) {
                setCandles(prev => [...prev, candle]);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [pairAddress, timeframe, loadHistoricalData]);

    const setOnCandleUpdate = useCallback((callback: (candle: CandleData) => void) => {
        onCandleUpdateRef.current = callback;
    }, []);

    return {
        candles,
        loading,
        currentPrice,
        setOnCandleUpdate,
    };
}
