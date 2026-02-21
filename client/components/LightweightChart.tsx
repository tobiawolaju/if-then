import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, HistogramData, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { CandleData } from '../services/candleAggregator';

interface LightweightChartProps {
    data: CandleData[];
    onTick?: (callback: (candle: CandleData) => void) => void;
    activeTool?: string;
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
    activeTool,
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

    // Tool State
    const [measureData, setMeasureData] = React.useState<{ start: any, end: any } | null>(null);
    const isDrawing = useRef(false);

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
                vertLines: { color: 'rgba(168, 85, 247, 0.03)' },
                horzLines: { color: 'rgba(168, 85, 247, 0.03)' },
            },
            crosshair: {
                mode: 0, // Normal mode
            },
            timeScale: {
                borderColor: 'rgba(168, 85, 247, 0.1)',
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: 'rgba(168, 85, 247, 0.1)',
            },
        });

        // 2. Add Candlestick Series
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#a855f7', // Purple
            downColor: 'rgba(255, 255, 255, 0.5)', // White 0.5 opacity
            borderVisible: false,
            wickUpColor: '#a855f7', // Purple
            wickDownColor: 'rgba(255, 255, 255, 0.5)', // White 0.5 opacity
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
            color: c.close >= c.open ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.2)',
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
                    color: candle.close >= candle.open ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.2)',
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

    // Tool Interactions Effect
    useEffect(() => {
        if (!chartRef.current || !candleSeriesRef.current || !activeTool) return;
        const chart = chartRef.current;
        const container = chartContainerRef.current;
        if (!container) return;

        const handleMouseDown = (e: MouseEvent) => {
            if (activeTool === 'cursor') return;
            isDrawing.current = true;

            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const time = chart.timeScale().coordinateToTime(x);
            const price = candleSeriesRef.current!.coordinateToPrice(y);

            if (activeTool === 'measure') {
                setMeasureData({ start: { time, price, x, y }, end: { time, price, x, y } });
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDrawing.current || activeTool === 'cursor') return;
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const time = chart.timeScale().coordinateToTime(x);
            const price = candleSeriesRef.current!.coordinateToPrice(y);

            if (activeTool === 'measure') {
                setMeasureData(prev => prev ? { ...prev, end: { time, price, x, y } } : null);
            }
        };

        const handleMouseUp = () => {
            isDrawing.current = false;
            if (activeTool === 'measure') {
                setTimeout(() => setMeasureData(null), 2000); // Keep visible for 2s
            }
        };

        container.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [activeTool]);

    const calculateMeasure = () => {
        if (!measureData) return null;
        const p1 = measureData.start;
        const p2 = measureData.end;
        const priceDelta = p2.price - p1.price;
        const percent = (priceDelta / p1.price) * 100;

        return {
            priceDelta: priceDelta.toFixed(2),
            percent: percent.toFixed(2) + '%',
            left: Math.min(p1.x, p2.x),
            top: Math.min(p1.y, p2.y),
            width: Math.abs(p2.x - p1.x),
            height: Math.abs(p2.y - p1.y),
            isUp: priceDelta >= 0
        };
    };

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
            color: c.close >= c.open ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.2)',
        }));

        candleSeriesRef.current.setData(formattedCandles);
        volumeSeriesRef.current.setData(formattedVolume);
    }, [data]);

    const measure = calculateMeasure();

    return (
        <div className="w-full h-full relative group">
            <div ref={chartContainerRef} className="w-full h-full" />

            {/* Ruler Overlay */}
            {measure && (
                <div
                    className="absolute pointer-events-none z-50 flex flex-col items-center justify-center border border-white/20 bg-white/5 backdrop-blur-[2px]"
                    style={{
                        left: measure.left,
                        top: measure.top,
                        width: measure.width,
                        height: measure.height,
                    }}
                >
                    <div className={`px-2 py-1 rounded-lg text-[10px] font-black font-mono shadow-2xl ${measure.isUp ? 'bg-buy/80 text-white' : 'bg-sell/80 text-white'}`}>
                        {measure.priceDelta} ({measure.percent})
                    </div>
                </div>
            )}

            {/* Tool Tooltip */}
            {activeTool !== 'cursor' && !measure && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none bg-neon/80 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                    {activeTool} tool active
                </div>
            )}
        </div>
    );
};
