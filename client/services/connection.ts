import { Connection } from '@solana/web3.js';

// Configuration for Solana network mapping
const RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';

/**
 * Singleton connection to the Solana cluster.
 * Ensures all services use the same underlying socket and commitment settings.
 */
export const solanaConnection = new Connection(RPC_ENDPOINT, {
    commitment: 'confirmed', // Wait for block confirmation by majority of cluster
    wsEndpoint: RPC_ENDPOINT.replace('https', 'wss').replace('http', 'ws'),
});
