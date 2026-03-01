export interface OrderBookEntry {
    price: string;
    size: string;
    total: string;
}

export interface OrderBookData {
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
}

// Helper to generate realistic-looking orderbook data
const generateRows = (startPrice: number, isAsk: boolean, count: number): OrderBookEntry[] => {
    let currentTotal = 0;
    const rows: OrderBookEntry[] = [];

    for (let i = 0; i < count; i++) {
        const step = (Math.random() * 0.5) + 0.1; // Random step between 0.1 and 0.6
        const price = startPrice + (isAsk ? (i * step) : -(i * step));

        // Random size between 0.01 and 5.00
        const size = (Math.random() * 4.99) + 0.01;
        currentTotal += size;

        rows.push({
            price: price.toFixed(2),
            size: size.toFixed(3),
            total: currentTotal.toFixed(3),
        });
    }

    return rows;
};

// Generate 1000 rows each for asks and bids around a synthetic mid-price of $96,500
// Note: Asks are usually displayed descending towards the mid price, 
// so we generate them ascending away from mid, and reverse them in the UI.
export const mockOrderBookData: OrderBookData = {
    asks: generateRows(96500.50, true, 1000),   // Starts at 96500.50 and goes up
    bids: generateRows(96499.50, false, 1000),  // Starts at 96499.50 and goes down
};
