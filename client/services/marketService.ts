import { getDeriverseClient } from './sdkClient';
import { DeriverseMarket } from '../types/deriverse';

/**
 * marketService
 *
 * Provides read-only data for active Deriverse v1 markets.
 */
export const marketService = {
    /**
     * Fetches active metadata for a given market (e.g. BTC-PERP).
     */
    async getMarketInfo(marketId: string): Promise<DeriverseMarket | null> {
        try {
            const client = getDeriverseClient();
            const market = await client.getMarket(marketId);

            // Map SDK response to our internal DeriverseMarket type
            return {
                ticker: marketId,
                price: market.price || 0,
                fundingRate: market.fundingRate || 0,
                openInterest: market.openInterest || 0,
            };
        } catch (e) {
            console.error(`Failed to fetch market info for ${marketId}`, e);
            return null;
        }
    },
};
