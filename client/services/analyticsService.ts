import { IndexerTrade } from '../types/deriverse';

/**
 * analyticsService
 *
 * Compute engine for pure deterministic math statistics calculating 
 * trading KPIs across the parsed history arrays. Pure Frontend math.
 */
export const analyticsService = {

    /**
     * Analyzes an array of resolved trades and computes core metrics.
     */
    computeMetrics(trades: IndexerTrade[]) {
        if (trades.length === 0) {
            return { winRate: 0, avgR: 0, maxDrawdown: 0, profitFactor: 0, expectancy: 0, sharpe: 0 };
        }

        const winningTrades = trades.filter(t => t.pnl > 0);
        const losingTrades = trades.filter(t => t.pnl <= 0);

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

        // Avg R (Reward-to-Risk ratio assuming simplified generic risk allocation)
        const avgR = avgLoss > 0 ? (avgWin / avgLoss) : 0;

        // Expectancy
        const winProbability = winRate / 100;
        const lossProbability = 1 - winProbability;
        const expectancy = (winProbability * avgWin) - (lossProbability * avgLoss);

        // Max Drawdown 
        let peak = 0;
        let maxDrawdown = 0;
        let cumulativePnl = 0;

        // Sort by timestamp for proper chronological sequence reading
        const sortedTrades = [...trades].sort((a, b) => a.timestamp - b.timestamp);

        for (const t of sortedTrades) {
            cumulativePnl += t.pnl;
            if (cumulativePnl > peak) {
                peak = cumulativePnl; // New equity high
            }

            const drawdown = peak - cumulativePnl;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        }

        // Simplified Sharpe Ratio Calculation (Assuming risk-free rate = 0% over period)
        const returns = sortedTrades.map(t => t.pnl);
        const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const standardDeviation = Math.sqrt(returns.map(x => Math.pow(x - meanReturn, 2)).reduce((a, b) => a + b, 0) / returns.length);
        const sharpe = standardDeviation > 0 ? (meanReturn / standardDeviation) * Math.sqrt(trades.length) : 0;

        return {
            winRate: Number(winRate.toFixed(2)),
            avgR: Number(avgR.toFixed(2)),
            maxDrawdown: Number(maxDrawdown.toFixed(2)),
            profitFactor: Number(profitFactor.toFixed(2)),
            expectancy: Number(expectancy.toFixed(2)),
            sharpe: Number(sharpe.toFixed(2)),
        };
    }
};
