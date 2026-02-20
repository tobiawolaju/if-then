import { solanaConnection } from './connection';
import { DeriverseCompatibleWallet } from './privyWalletBridge';
// Replace this with the actual import when installing: import { DeriverseClient } from '@deriverse/kit';

// Mock Deriverse Client for scaffolding
class DeriverseClient {
    constructor(public connection: any, public wallet: any, public options: any) { }

    // Method stubs representing standard SDK functionalities
    async initialize(): Promise<boolean> { return true; }
    async getMarket(marketId: string): Promise<any> { return {}; }
    async submitOrder(orderParams: any): Promise<any> { return { signature: 'mock-sig' }; }
    async getPositions(owner: string): Promise<any[]> { return []; }
}

let sdkInstance: DeriverseClient | null = null;

/**
 * Initializes the @deriverse/kit SDK as a singleton.
 * Call this function immediately after the user logs in via Privy and the signer bridge is created.
 *
 * @param {DeriverseCompatibleWallet} wallet - the bridged Privy wallet.
 * @returns {DeriverseClient} the active initialized singleton client.
 */
export async function initializeDeriverseSDK(wallet: DeriverseCompatibleWallet): Promise<DeriverseClient> {
    if (sdkInstance) {
        return sdkInstance;
    }

    // Inject Solana Connection & DeriverseCompatibleWallet
    const client = new DeriverseClient(solanaConnection, wallet, {
        env: process.env.NEXT_PUBLIC_DERIVERSE_ENV || 'devnet',
    });

    await client.initialize();

    sdkInstance = client;
    return client;
}

/**
 * Helper to get the existing instance if instantiated.
 */
export function getDeriverseClient(): DeriverseClient {
    if (!sdkInstance) {
        throw new Error("Deriverse SDK is not initialized. User must log in first.");
    }
    return sdkInstance;
}
