import { createPrivySigner, PrivyWallet } from './privyWalletBridge';
import { initializeDeriverseSDK } from './sdkClient';
import { marketService } from './marketService';
import { positionService } from './positionService';
import { tradeService } from './tradeService';
import { subscriptionService } from './subscriptionService';
import { journalIndexerService } from './journalIndexerService';
import { analyticsService } from './analyticsService';

/**
 * exampleTradingFlow
 *
 * Example functional sequence satisfying:
 * 1. User logs in via Privy
 * 2. SDK initializes
 * 3. User places order
 * 4. Confirmation listener updates positions
 * 5. Analytics recompute
 * 
 * NOTE: This is an illustrative script, not a mounted React component.
 */
export async function exampleTradingFlow(mockPrivyWallet: PrivyWallet) {
    try {
        console.log("1. User logs in via Privy...");
        // Mock user login already occurred and mockPrivyWallet object is supplied.
        const walletAddress = mockPrivyWallet.address;

        console.log("2. SDK initializes with Signer Adapter Bridge.");
        const compatibleWallet = createPrivySigner(mockPrivyWallet);
        const sdkClient = await initializeDeriverseSDK(compatibleWallet);
        console.log("SDK Initialized.");

        // (Optional) Kickoff background real-time subscriptions
        subscriptionService.startAccountListener(walletAddress);

        // Initial state fetching
        const btcMarket = await marketService.getMarketInfo('BTC-PERP');
        const existingPositions = await positionService.refreshPositions();
        console.log(`Current active positions size: ${existingPositions.length}`);

        console.log("3. User places order on BTC-PERP.");
        const orderResult = await tradeService.submitOrder('BTC-PERP', 'buy', 0.5, btcMarket?.price);

        console.log(`Order status is: ${orderResult.status} with signature ${orderResult.signature}`);

        // Assuming the user waits, the Confirmation Listener built into tradeService
        // will pick up the execution and automatically re-call `positionService.refreshPositions();`
        console.log("4. Confirmation listener awaits updating positions in background...");

        console.log("5. App analytics compute history via RPC indexing (Since we did a trade action).");
        const historicalTrades = await journalIndexerService.fetchTradeHistory(walletAddress);

        // Process statistical engine math deterministic performance metrics 
        const kpis = analyticsService.computeMetrics(historicalTrades);
        console.log("Player Output KPIs Recomputed:", kpis);

    } catch (error) {
        console.error("Trading flow encountered an error.", error);
    }
}
