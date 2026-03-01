import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

// The interface provided by Privy's useWallets()
export interface PrivyWallet {
    address: string;
    signTransaction: (tx: any) => Promise<any>;
}

// The wallet interface expected by @deriverse/kit SDK
export interface DeriverseCompatibleWallet {
    publicKey: PublicKey;
    signTransaction: <T extends Transaction | VersionedTransaction>(transaction: T) => Promise<T>;
    signAllTransactions: <T extends Transaction | VersionedTransaction>(transactions: T[]) => Promise<T[]>;
}

/**
 * createPrivySigner
 *
 * This function is the critical bridge layer. Privy wallets do not naturally
 * implement the standard `Wallet` adapter interface that Deriverse v1 SDK expects.
 * 
 * We extract `publicKey` and map the `signTransaction` payload directly.
 * We also shim `signAllTransactions` by sequentially signing since batch
 * signing may not be fully supported natively by the embedded wallet.
 *
 * @param {PrivyWallet} privyWallet - the wallet object from Privy.
 * @returns {DeriverseCompatibleWallet} A compatible signer object for the SDK.
 */
export function createPrivySigner(privyWallet: PrivyWallet): DeriverseCompatibleWallet {
    const publicKey = new PublicKey(privyWallet.address);

    return {
        publicKey,

        signTransaction: async <T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> => {
            // Direct pass-through to Privy's signing implementation
            const signed = await privyWallet.signTransaction(transaction);
            return signed as T;
        },

        signAllTransactions: async <T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]> => {
            const signedTransactions: T[] = [];
            for (const tx of transactions) {
                signedTransactions.push(await privyWallet.signTransaction(tx));
            }
            return signedTransactions;
        },
    };
}
