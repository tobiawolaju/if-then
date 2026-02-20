import { getDeriverseClient } from './sdkClient';
import { DeriversePosition } from '../types/deriverse';

/**
 * positionService
 *
 * Reads user positions, open orders, and margin details from the SDK.
 */
export const positionService = {
    /**
     * Refreshes positions by querying the current active account.
     */
    async refreshPositions(): Promise<DeriversePosition[]> {
        try {
            const client = getDeriverseClient();

            // Ensure wallet address is provided to find associated positions 
            const positions = await client.getPositions(client.wallet.publicKey.toBase58());

            // Zustand Store Update Logic Goes Here
            // e.g. useDeriverseStore.getState().setPositions(positions);

            return positions as DeriversePosition[];
        } catch (e) {
            console.error('Failed to refresh positions', e);
            return [];
        }
    },

    /**
     * Return margin details using active API context.
     */
    async getMargin(walletAddress: string): Promise<number> {
        try {
            // Mocked
            return 1000.0;
        } catch (e) {
            return 0;
        }
    }
};
