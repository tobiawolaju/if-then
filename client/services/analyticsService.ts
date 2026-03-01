import { IndexerTrade } from '../types/deriverse';

export const analyticsService = {
    /**
     * Analyzes an array of resolved trades and computes core metrics 
     * matching the Deriverse hackathon scope.
     */
    computeMetrics(trades: IndexerTrade[]) {
        if (trades.length === 0) {
            return {
                winRate: 0,
                avgR: 0,
                maxDrawdown: 0,
                profitFactor: 0,
                expectancy: 0,
                sharpe: 0,
                totalPnL: 0,
                totalVolume: 0,
                totalFees: 0,
                tradeCount: 0,
                longCount: 0,
                shortCount: 0,
                avgDuration: 0,
                largestGain: 0,
                largestLoss: 0,
                avgWin: 0,
                avgLoss: 0,
                feeBreakdown: { protocol: 0, gas: 0 },
                pnlHistory: [],
                sessionPerformance: { london: 0, ny: 0, asia: 0 }
            };
        }

        const winningTrades = trades.filter(t => t.pnl > 0);
        const losingTrades = trades.filter(t => t.pnl <= 0);
        const longs = trades.filter(t => t.side === 'buy');
        const shorts = trades.filter(t => t.side === 'sell');

        // Totals
        const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
        const totalVolume = trades.reduce((sum, t) => sum + (t.size * t.entry), 0);
        const totalFees = trades.reduce((sum, t) => sum + t.fee, 0);

        // Win Rate (%)
        const winRate = (winningTrades.length / trades.length) * 100;

        // Gross Totals
        const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
        const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));

        // Profit Factor
        const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss) : grossProfit > 0 ? Infinity : 0;

        // Averages
        const avgWin = winningTrades.length > 0 ? grossProfit / winningTrades.length : 0;
        const avgLoss = losingTrades.length > 0 ? grossLoss / losingTrades.length : 0;

        // Largest gain/loss
        const largestGain = Math.max(...trades.map(t => t.pnl), 0);
        const largestLoss = Math.min(...trades.map(t => t.pnl), 0);

        // Max Drawdown & PnL History
        let peak = 0;
        let maxDrawdown = 0;
        let cumulativePnl = 0;
        const pnlHistory: { timestamp: number, pnl: number, drawdown: number }[] = [];

        const sortedTrades = [...trades].sort((a, b) => a.timestamp - b.timestamp);

        for (const t of sortedTrades) {
            cumulativePnl += t.pnl;
            if (cumulativePnl > peak) peak = cumulativePnl;

            const drawdown = peak - cumulativePnl;
            if (drawdown > maxDrawdown) maxDrawdown = drawdown;

            pnlHistory.push({
                timestamp: t.timestamp,
                pnl: cumulativePnl,
                drawdown: drawdown
            });
        }

        // Session/Time based performance
        const sessionPerformance = { london: 0, ny: 0, asia: 0 };
        sortedTrades.forEach(t => {
            const hour = new Date(t.timestamp).getUTCHours();
            if (hour >= 8 && hour < 16) sessionPerformance.london += t.pnl;
            else if (hour >= 13 && hour < 21) sessionPerformance.ny += t.pnl; // Overlapping
            else sessionPerformance.asia += t.pnl;
        });

        // Simplified Sharpe Ratio Calculation
        const returns = sortedTrades.map(t => t.pnl);
        const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const standardDeviation = Math.sqrt(returns.map(x => Math.pow(x - meanReturn, 2)).reduce((a, b) => a + b, 0) / returns.length);
        const sharpe = standardDeviation > 0 ? (meanReturn / standardDeviation) * Math.sqrt(trades.length) : 0;

        return {
            totalPnL: Number(totalPnL.toFixed(2)),
            totalVolume: Number(totalVolume.toFixed(2)),
            totalFees: Number(totalFees.toFixed(2)),
            tradeCount: trades.length,
            winRate: Number(winRate.toFixed(2)),
            avgR: avgLoss > 0 ? Number((avgWin / avgLoss).toFixed(2)) : 0,
            maxDrawdown: Number(maxDrawdown.toFixed(2)),
            profitFactor: Number(profitFactor.toFixed(2)),
            expectancy: Number(((winRate / 100 * avgWin) - ((1 - winRate / 100) * avgLoss)).toFixed(2)),
            longCount: longs.length,
            shortCount: shorts.length,
            largestGain: Number(largestGain.toFixed(2)),
            largestLoss: Number(largestLoss.toFixed(2)),
            avgWin: Number(avgWin.toFixed(2)),
            avgLoss: Number(avgLoss.toFixed(2)),
            sharpe: Number(sharpe.toFixed(2)),
            sessionPerformance,
            pnlHistory
        };
    }
};
