"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { createPrivySigner } from "@/services/privyWalletBridge";
import { initializeDeriverseSDK } from "@/services/sdkClient";
import { subscriptionService } from "@/services/subscriptionService";

export default function LoginButton() {
    const { login, logout, authenticated, user } = usePrivy();
    const { wallets } = useWallets();
    const [isInitializing, setIsInitializing] = useState(false);

    useEffect(() => {
        async function setupDeriverse() {
            if (authenticated && wallets.length > 0 && !isInitializing) {
                setIsInitializing(true);
                try {
                    // Get the active embedded/external Privy wallet
                    const activeWallet = wallets[0];

                    // 1. Bridge the connection
                    const compatibleSigner = createPrivySigner({
                        address: activeWallet.address,
                        signTransaction: async (tx) => {
                            // Get the actual provider sign strategy
                            const provider = await activeWallet.getProvider();
                            // Mapping Privy's EIP-1193ish interface -> Solana signTransaction
                            // Simplified mock implementation for this scaffold
                            console.log("Privy signing requested for:", tx);
                            return tx;
                        }
                    });

                    // 2. Initialize the heavy SDK singleton
                    await initializeDeriverseSDK(compatibleSigner);
                    console.log("🟢 Deriverse SDK successfully initialized with user wallet!");

                    // 3. Kick off real-time margin checking WebSockets
                    subscriptionService.startAccountListener(activeWallet.address);

                } catch (err) {
                    console.error("Failed to initialize Deriverse SDK via Privy:", err);
                } finally {
                    setIsInitializing(false);
                }
            }
        }

        setupDeriverse();

        // Cleanup listener on unmount
        return () => {
            subscriptionService.stopAccountListener();
        };
    }, [authenticated, wallets, isInitializing]);

    if (authenticated && user) {
        return (
            <button
                onClick={logout}
                className="flex items-center gap-2 bg-abyss-card hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full font-medium transition-all text-sm group"
            >
                <span className="w-2 h-2 rounded-full bg-buy shadow-[0_0_8px_#22c55e]"></span>
                {user.wallet?.address.slice(0, 4)}...{user.wallet?.address.slice(-4)}
                <LogOut size={14} className="opacity-50 group-hover:opacity-100 transition-opacity ml-1" />
            </button>
        );
    }

    return (
        <button
            onClick={login}
            className="flex items-center gap-2 bg-neon hover:bg-neon-dim text-white px-5 py-2 rounded-full font-bold transition-all shadow-lg shadow-neon/20 hover:scale-105 active:scale-95 text-sm"
        >
            <LogIn size={16} />
            Connect Wallet
        </button>
    );
}
