import { Connection, clusterApiUrl } from '@solana/web3.js';

/**
 * Global Solana RPC Connection instance.
 * Defaults to Devnet for hackathon testing.
 */
export const solanaConnection = new Connection(
    process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl('devnet'),
    'confirmed'
);
