import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, HistogramData, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { CandleData } from '../services/candleAggregator';

interface LightweightChartProps {
    data: CandleData[];
    onTick?: (callback: (candle: CandleData) => void) => void;
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
}

/**
 * LightweightChart
 * 
 * High-performance trading chart component using TradingView Lightweight Charts.
 * Utilizes imperative updates for live data to avoid React re-renders.
 */
export const LightweightChart: React.FC<LightweightChartProps> = ({
    data,
    onTick,
    colors: {
        backgroundColor = '#09090b',
        lineColor = '#a855f7',
        textColor = '#71717a',
    } = {},
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // 1. Initialize Chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
                fontFamily: 'Inter, ui-sans-serif, system-ui',
            },
            grid: {
                vertLines: { color: 'rgba(168, 85, 247, 0.05)' },
                horzLines: { color: 'rgba(168, 85, 247, 0.05)' },
            },
            crosshair: {
                mode: 0, // Normal mode
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
        });

        // 2. Add Candlestick Series
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
        });

        // 3. Add Volume Histogram (on bottom)
        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#a855f7',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '', // Overlay over the main pane
        });

        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        chartRef.current = chart;
        candleSeriesRef.current = candleSeries;
        volumeSeriesRef.current = volumeSeries;

        // 4. Set Initial Data
        const formattedCandles: CandlestickData[] = data.map(c => ({
            time: c.time as any,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
        }));

        const formattedVolume: HistogramData[] = data.map(c => ({
            time: c.time as any,
            value: c.volume,
            color: c.close >= c.open ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        }));

        candleSeries.setData(formattedCandles);
        volumeSeries.setData(formattedVolume);

        // 5. Setup Live Subscription
        if (onTick) {
            onTick((candle) => {
                candleSeries.update({
                    time: candle.time as any,
                    open: candle.open,
                    high: candle.high,
                    low: candle.low,
                    close: candle.close,
                });
                volumeSeries.update({
                    time: candle.time as any,
                    value: candle.volume,
                    color: candle.close >= candle.open ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
                });
            });
        }

        // 6. Handle Resize
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [backgroundColor, textColor, onTick]); // Only re-init on theme change

    // Handle data updates (e.g. timeframe change or initial historical load finishing)
    useEffect(() => {
        if (!candleSeriesRef.current || !volumeSeriesRef.current) return;

        const formattedCandles: CandlestickData[] = data.map(c => ({
            time: c.time as any,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
        }));

        const formattedVolume: HistogramData[] = data.map(c => ({
            time: c.time as any,
            value: c.volume,
            color: c.close >= c.open ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        }));

        candleSeriesRef.current.setData(formattedCandles);
        volumeSeriesRef.current.setData(formattedVolume);
    }, [data]);

    return (
        <div className="w-full h-full relative">
            <div ref={chartContainerRef} className="w-full h-full" />
        </div>
    );
};
