import { getDeriverseClient } from './sdkClient';
import { solanaConnection } from './connection';
import { TradeResult } from '../types/deriverse';
import { positionService } from './positionService';

/**
 * tradeService
 *
 * Handling all written transactions for trades.
 * Integrates Deriverse SDK + Privy signer + Transaction lifecycle listening on Solana Connection.
 */
export const tradeService = {
    /**
     * Submits a new market or limit order. 
     * Provides a signature immediately via SDK but handles "confirmed" tracking.
     */
    async submitOrder(marketId: string, side: 'buy' | 'sell', size: number, price?: number): Promise<TradeResult> {
        try {
            const client = getDeriverseClient();

            // Submit Transaction and payload signing handled securely by Privy inside SDK client
            const signature = await client.submitOrder({
                market: marketId,
                side,
                size,
                price,
                orderType: price ? 'limit' : 'market'
            });

            // Kick off the listener without blocking the immediate transaction broadcast
            this.listenForConfirmation(signature.signature);

            return {
                status: 'pending',
                signature: signature.signature,
            };
        } catch (e: any) {
            console.error('Failed to submit order', e);
            return {
                status: 'failed',
                error: e.message || 'Unknown error occurred.',
            };
        }
    },

    /**
     * Confirms a transaction via Solana Connection and triggers subsequent state refetching.
     */
    listenForConfirmation(signature: string): void {
        const confirmationStrategy = {
            signature,
        };

        solanaConnection.onSignature(signature, async (result, context) => {
            if (result.err) {
                console.error(`Transaction ${signature} failed!`, result.err);
                // Note: Could emit an event to update Zustand store state here (failed)
            } else {
                console.log(`Transaction ${signature} confirmed in slot ${context.slot}!`);
                // Trigger a background refetch so UI automatically updates with zero page reloads
                await positionService.refreshPositions();
            }
        }, 'confirmed');
    }
};
