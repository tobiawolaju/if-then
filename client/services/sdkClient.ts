/**
 * sdkClient
 * 
 * NOTE: This was the mock Deriverse SDK client for the hackathon scaffold.
 * It's been replaced by the DexScreener service for market data.
 * 
 * Kept as a stub to prevent import errors from any remaining references.
 * Will be removed entirely when all callers are migrated.
 */

// No-op stub — replaced by dexscreenerService.ts for market data
export async function initializeDeriverseSDK(_wallet: any): Promise<any> {
    console.warn('sdkClient: Deriverse SDK is deprecated. Use dexscreenerService instead.');
    return {};
}

export function getDeriverseClient(): any {
    console.warn('sdkClient: Deriverse SDK is deprecated. Use dexscreenerService instead.');
    return {};
}
