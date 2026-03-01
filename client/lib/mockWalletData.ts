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
    totalBalanceUsd: "$1,245,670.00",
    tokens: [
        {
            id: "hype",
            symbol: "HYPE",
            name: "Hyperliquid",
            balance: "45,000.00",
            usdValue: "$630,000.00",
            change24h: "8.4%",
            isUp: true
        },
        {
            id: "btc",
            symbol: "BTC",
            name: "Bitcoin",
            balance: "4.25",
            usdValue: "$412,250.00",
            change24h: "1.2%",
            isUp: true
        },
        {
            id: "eth",
            symbol: "ETH",
            name: "Ethereum",
            balance: "32.50",
            usdValue: "$91,000.00",
            change24h: "3.5%",
            isUp: true
        },
        {
            id: "sui",
            symbol: "SUI",
            name: "Sui",
            balance: "15,000.00",
            usdValue: "$52,500.00",
            change24h: "12.2%",
            isUp: true
        },
        {
            id: "usdc",
            symbol: "USDC",
            name: "USD Coin",
            balance: "50,000.00",
            usdValue: "$50,000.00",
            change24h: "0.00%",
            isUp: true
        },
        {
            id: "mega",
            symbol: "MEGA",
            name: "Mega",
            balance: "920,000.00",
            usdValue: "$9,920.00",
            change24h: "2.1%",
            isUp: false
        }
    ]
};
