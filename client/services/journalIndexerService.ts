/**
 * journalIndexerService
 * 
 * NOTE: This service was originally built for Solana/Deriverse.
 * It's temporarily stubbed for the Monad migration.
 * The journal still works via mock data in mockData.ts.
 * 
 * TODO: Implement Monad-native transaction history parsing when
 * wallet integration is added.
 */

import { IndexerTrade } from '../types/deriverse';

export const journalIndexerService = {
    /**
     * Fetches trade history for a wallet.
     * Currently returns empty — journal falls back to mockData entries.
     */
    async fetchTradeHistory(_walletAddress: string): Promise<IndexerTrade[]> {
        console.warn('journalIndexerService: Monad indexer not yet implemented, returning empty.');
        return [];
    }
};
