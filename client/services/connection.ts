/**
 * Monad RPC Configuration.
 * 
 * Note: The Solana-specific connection is no longer the primary connection.
 * This module now exports Monad chain configuration.
 * The @solana/web3.js Connection is kept for backward compatibility
 * with any remaining Solana-specific code paths.
 */

// Monad Chain Configuration
export const MONAD_RPC_URL = process.env.NEXT_PUBLIC_MONAD_RPC || 'https://rpc.monad.xyz/monad';
export const MONAD_CHAIN_ID_NUM = 10143; // Monad mainnet chain ID (EVM)

// Legacy Solana connection — kept for backward compat, will be removed later
// import { Connection, clusterApiUrl } from '@solana/web3.js';
// export const solanaConnection = new Connection(
//     process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl('devnet'),
//     'confirmed'
// );
