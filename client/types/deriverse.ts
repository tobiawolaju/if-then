export type TradeStatus = "pending" | "confirmed" | "failed";

export interface TradeResult {
    status: TradeStatus;
    signature?: string;
    error?: string;
}

export interface IndexerTrade {
    id: string;
    market: string;
    side: "buy" | "sell";
    entry: number;
    exit: number;
    size: number;
    pnl: number;
    fee: number;
    timestamp: number;
}

// These types usually come from @deriverse/kit
export interface DeriverseMarket {
    ticker: string;
    price: number;
    fundingRate: number;
    openInterest: number;
}

export interface DeriversePosition {
    id: string;
    market: string;
    side: "long" | "short";
    size: number;
    averageEntryPrice: number;
    unrealizedPnl: number;
}
