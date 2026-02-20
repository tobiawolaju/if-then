import { PublicKey } from '@solana/web3.js';
import { solanaConnection } from './connection';

/**
 * subscriptionService
 *
 * Real-time active data listeners tying back into the Zustand logic states.
 */
export const subscriptionService = {

    privateAccountSubscriptionId: null as number | null,

    /**
     * Subscribes to solana system account changes for instant balance/margin updates.
     */
    startAccountListener(walletAddress: string) {
        if (this.privateAccountSubscriptionId !== null) return;

        // Subscribe to raw account changes with commitment level
        this.privateAccountSubscriptionId = solanaConnection.onAccountChange(
            new PublicKey(walletAddress),
            (accountInfo, context) => {
                console.log(`Account margin updated in slot ${context.slot}`);
                // Dispatch event payload logic for Zustand re-render mapping here
                // e.g. useDeriverseStore.getState().handleMarginChange(accountInfo);
            },
            'confirmed'
        );
    },

    /**
     * Closes active subscriptions when Wallet unmounts or dismounts
     */
    stopAccountListener() {
        if (this.privateAccountSubscriptionId !== null) {
            solanaConnection.removeAccountChangeListener(this.privateAccountSubscriptionId);
            this.privateAccountSubscriptionId = null;
        }
    }
};
