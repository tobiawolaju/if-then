export interface Token {
    id: string;
    symbol: string;
    name: string;
    price?: number;
}

export const mockMarkets: Token[] = [
    { id: "mon-usdc", symbol: "MON/USDC", name: "Monad" },
    { id: "sol-usdc", symbol: "SOL/USDC", name: "Solana" },
    { id: "eth-usdc", symbol: "ETH/USDC", name: "Ethereum" },
    { id: "btc-usdc", symbol: "BTC/USDC", name: "Bitcoin" },
];
