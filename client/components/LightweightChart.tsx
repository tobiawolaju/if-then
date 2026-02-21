import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, HistogramData, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { CandleData } from '../services/candleAggregator';

interface LightweightChartProps {
    data: CandleData[];
    onTick?: (callback: (candle: CandleData) => void) => void;
    activeTool?: string;
    isMagnetActive?: boolean;
    onToolChange?: (tool: string) => void;
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
}

// Drawing types
type Point = { logical: number | null, price: number };
type Drawing = {
    id: string;
    type: string;
    start?: Point;
    end?: Point;
    price?: number; // For levels
    temporary?: boolean;
};

export const LightweightChart: React.FC<LightweightChartProps> = ({
    data,
    onTick,
    activeTool = 'cursor',
    isMagnetActive = false,
    onToolChange,
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

    // Drawing State
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [currentDrawing, setCurrentDrawing] = useState<Drawing | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [, forceRender] = useState({});

    // 1. Tool Lifecycle (Trash)
    useEffect(() => {
        if (activeTool === 'trash') {
            setDrawings([]);
            setCurrentDrawing(null);
            setIsDrawing(false);
            if (onToolChange) onToolChange('cursor');
        }
    }, [activeTool, onToolChange]);


    // 2. Chart Initialization
    useEffect(() => {
        if (!chartContainerRef.current) return;

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
            crosshair: { mode: 0 },
            timeScale: {
                borderColor: 'rgba(168, 85, 247, 0.1)',
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: { borderColor: 'rgba(168, 85, 247, 0.1)' },
        });

        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#a855f7',
            downColor: 'rgba(255, 255, 255, 0.5)',
            borderVisible: false,
            wickUpColor: '#a855f7',
            wickDownColor: 'rgba(255, 255, 255, 0.5)',
        });

        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#a855f7',
            priceFormat: { type: 'volume' },
            priceScaleId: '',
        });

        volumeSeries.priceScale().applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 },
        });

        chartRef.current = chart;
        candleSeriesRef.current = candleSeries;
        volumeSeriesRef.current = volumeSeries;

        // Force render on pan/zoom to update SVG overlay
        const handlePanZoom = () => forceRender({});
        chart.timeScale().subscribeVisibleLogicalRangeChange(handlePanZoom);

        // Map initial data
        const formattedCandles: CandlestickData[] = data.map(c => ({
            time: c.time as any, open: c.open, high: c.high, low: c.low, close: c.close,
        }));
        const formattedVolume: HistogramData[] = data.map(c => ({
            time: c.time as any, value: c.volume,
            color: c.close >= c.open ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.2)',
        }));
        candleSeries.setData(formattedCandles);
        volumeSeries.setData(formattedVolume);

        if (onTick) {
            onTick((candle) => {
                candleSeries.update({
                    time: candle.time as any, open: candle.open, high: candle.high, low: candle.low, close: candle.close,
                });
                volumeSeries.update({
                    time: candle.time as any, value: candle.volume,
                    color: candle.close >= candle.open ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                });
            });
        }

        const handleResize = () => chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.timeScale().unsubscribeVisibleLogicalRangeChange(handlePanZoom);
            chart.remove();
        };
    }, [backgroundColor, textColor, onTick]);

    // 3. Data Updates (Reacting to external data changes)
    useEffect(() => {
        if (!candleSeriesRef.current || !volumeSeriesRef.current) return;
        const formattedCandles: CandlestickData[] = data.map(c => ({
            time: c.time as any, open: c.open, high: c.high, low: c.low, close: c.close,
        }));
        const formattedVolume: HistogramData[] = data.map(c => ({
            time: c.time as any, value: c.volume,
            color: c.close >= c.open ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.2)',
        }));
        candleSeriesRef.current.setData(formattedCandles);
        volumeSeriesRef.current.setData(formattedVolume);
    }, [data]);


    // 4. Drawing Layer Interactions
    const getPointFromEvent = useCallback((e: React.PointerEvent) => {
        if (!chartRef.current || !candleSeriesRef.current || !data.length) return null;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const logical = chartRef.current.timeScale().coordinateToLogical(x);
        let price = candleSeriesRef.current.coordinateToPrice(y);

        if (price === null || logical === null) return null;

        // Magnet Logic
        if (isMagnetActive) {
            const index = Math.max(0, Math.min(Math.round(logical), data.length - 1));
            const candle = data[index];
            if (candle) {
                // Find closest OHLC price
                const prices = [candle.open, candle.high, candle.low, candle.close];
                price = prices.reduce((prev, curr) => Math.abs(curr - price!) < Math.abs(prev - price!) ? curr : prev) as any;
            }
        }

        return { logical: logical as number, price: price as number };
    }, [data, isMagnetActive]);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (activeTool === 'cursor' || activeTool === 'trash') return;

        const p = getPointFromEvent(e);
        if (!p) return;

        if (activeTool === 'level') {
            setDrawings(prev => [...prev, { id: Date.now().toString(), type: 'level', price: p.price as number }]);
            if (onToolChange) onToolChange('cursor'); // Auto-revert
            return;
        }

        setIsDrawing(true);
        setCurrentDrawing({ id: 'temp', type: activeTool, start: p, end: p });
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDrawing || !currentDrawing) return;
        const p = getPointFromEvent(e);
        if (!p) return;
        setCurrentDrawing(prev => prev ? { ...prev, end: p } : null);
    };

    const handlePointerUp = () => {
        if (!isDrawing || !currentDrawing) return;
        setIsDrawing(false);

        if (currentDrawing.type === 'measure') {
            const measureObj = { ...currentDrawing, id: Date.now().toString(), temporary: true };
            if (measureObj.start?.logical !== measureObj.end?.logical) {
                setDrawings(prev => [...prev, measureObj]);
                setTimeout(() => {
                    setDrawings(prev => prev.filter(d => d.id !== measureObj.id));
                }, 3000); // Dissolve after 3 seconds
            }
            if (onToolChange) onToolChange('cursor');
        } else {
            // Save trend line
            if (currentDrawing.start?.logical !== currentDrawing.end?.logical) {
                setDrawings(prev => [...prev, { ...currentDrawing, id: Date.now().toString() }]);
            }
            if (onToolChange) onToolChange('cursor');
        }
        setCurrentDrawing(null);
    };

    // 5. Drawing Renderer
    const resolveCoords = (logical: number | null | undefined, price: number | undefined) => {
        if (!chartRef.current || !candleSeriesRef.current || logical == null || price == null) return null;
        const x = chartRef.current.timeScale().logicalToCoordinate(logical as any);
        const y = candleSeriesRef.current.priceToCoordinate(price);
        if (x === null || y === null) return null;
        return { x, y };
    };

    const renderSVG = (d: Drawing) => {
        if (d.type === 'level' && d.price != null) {
            const y = candleSeriesRef.current?.priceToCoordinate(d.price);
            if (y == null) return null;
            return <line key={d.id} x1="0" y1={y} x2="100%" y2={y} stroke="#eab308" strokeWidth="2" strokeDasharray="5,5" className="opacity-90 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />;
        }

        const s = resolveCoords(d.start?.logical, d.start?.price);
        const e = resolveCoords(d.end?.logical, d.end?.price);
        if (!s || !e) return null;

        if (d.type === 'trend') {
            return <line key={d.id} x1={s.x} y1={s.y} x2={e.x} y2={e.y} stroke="#eab308" strokeWidth="3" strokeLinecap="round" className="opacity-100 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />;
        }

        if (d.type === 'measure' && d.start && d.end) {
            const width = Math.abs(e.x - s.x);
            const height = Math.abs(e.y - s.y);
            const left = Math.min(s.x, e.x);
            const top = Math.min(s.y, e.y);

            const priceDelta = d.end.price - d.start.price;
            const percent = ((priceDelta) / Math.abs(d.start.price)) * 100;
            const isUp = priceDelta >= 0;

            return (
                <g key={d.id}>
                    <rect x={left} y={top} width={Math.max(width, 1)} height={Math.max(height, 1)} fill={isUp ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'} stroke={isUp ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)'} strokeWidth="1.5" strokeDasharray="4,4" />
                    <foreignObject x={left + width / 2 - 60} y={top + height / 2 - 15} width="120" height="30" className="overflow-visible pointer-events-none">
                        <div className={`flex items-center justify-center text-[10px] font-black font-mono rounded px-1.5 py-0.5 whitespace-nowrap shadow-xl ${isUp ? 'bg-buy text-white' : 'bg-sell text-white'}`}>
                            {priceDelta > 0 ? '+' : ''}{priceDelta.toFixed(3)} ({isUp ? '+' : ''}{percent.toFixed(2)}%)
                        </div>
                    </foreignObject>
                </g>
            );
        }
        return null;
    };

    const isInteractionLayerActive = activeTool !== 'cursor' && activeTool !== 'trash';

    return (
        <div className="w-full h-full relative overflow-hidden group">
            {/* The Lightweight Chart Container */}
            <div ref={chartContainerRef} className="w-full h-full" />

            {/* SVG Drawing Overlay */}
            <svg className="absolute inset-0 w-full h-full z-30 pointer-events-none">
                {drawings.map(renderSVG)}
                {currentDrawing && renderSVG(currentDrawing)}
            </svg>

            {/* Interaction Shield */}
            {isInteractionLayerActive && (
                <div
                    className="absolute inset-0 z-40 cursor-crosshair touch-none"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    // Prevent chart from receiving these events
                    onContextMenu={(e) => e.preventDefault()}
                />
            )}

            {/* Tool Tooltip */}
            {activeTool !== 'cursor' && activeTool !== 'trash' && !isDrawing && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none bg-neon/80 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                    {activeTool} tool active - Draw on chart
                </div>
            )}
        </div>
    );
};
