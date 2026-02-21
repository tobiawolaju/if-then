export interface TokenBalance {
    id: string;
    symbol: string;
    name: string;
    balance: string;
    usdValue: string;
    change24h: string;
    isUp: boolean;
}

export interface WalletData {
    address: string;
    totalBalanceUsd: string;
    tokens: TokenBalance[];
}

export const mockWalletData: WalletData = {
    address: "0x7F9a...3B2C",
    totalBalanceUsd: "$142,450.00",
    tokens: [
        {
            id: "usdc",
            symbol: "USDC",
            name: "USD Coin",
            balance: "100,000.00",
            usdValue: "$100,000.00",
            change24h: "0.00%",
            isUp: true
        },
        {
            id: "sol",
            symbol: "SOL",
            name: "Solana",
            balance: "145.50",
            usdValue: "$20,370.00",
            change24h: "5.2%",
            isUp: true
        },
        {
            id: "wbtc",
            symbol: "WBTC",
            name: "Wrapped Bitcoin",
            balance: "0.22",
            usdValue: "$22,080.00",
            change24h: "1.4%",
            isUp: false
        }
    ]
};
