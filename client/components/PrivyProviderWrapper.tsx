"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export default function PrivyProviderWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "replace-with-your-privy-app-id"}
            config={{
                // Customize Privy's appearance in your app
                appearance: {
                    theme: "dark",
                    accentColor: "#a855f7",
                    logo: "", // Add your TrueDex logo URL here
                },
                // Create embedded wallets for users who don't have a wallet
                embeddedWallets: {
                    createOnLogin: "users-without-wallets",
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}
