// ─── Trading Journal Mock Data ───────────────────────────────
export interface JournalEntry {
  id: string;
  pair: string;
  pnl: number;
  emotion: string;
  notes: string;
  date: string;
  tags: string[];
}

export const journalEntries: JournalEntry[] = [
  {
    id: "j1",
    pair: "SOL/USDC",
    pnl: 342.5,
    emotion: "😎",
    notes: "Clean breakout from the 4H consolidation. Entered on retest of the $148 level.",
    date: "2026-02-19",
    tags: ["Strategy"],
  },
  {
    id: "j2",
    pair: "BTC/USDC",
    pnl: -128.3,
    emotion: "😤",
    notes: "FOMO'd into a pump. No setup, just chased the green candle.",
    date: "2026-02-18",
    tags: ["FOMO"],
  },
  {
    id: "j3",
    pair: "ETH/USDC",
    pnl: 89.1,
    emotion: "🧊",
    notes: "Scalped the London session open. Tight stop, quick profit.",
    date: "2026-02-17",
    tags: ["Strategy"],
  },
  {
    id: "j4",
    pair: "SOL/USDC",
    pnl: -45.0,
    emotion: "🤦",
    notes: "Fat-fingered the size. Meant 0.5 SOL, entered 5 SOL.",
    date: "2026-02-16",
    tags: ["Fat Finger"],
  },
  {
    id: "j5",
    pair: "ARB/USDC",
    pnl: 210.8,
    emotion: "💎",
    notes: "Held through the dip on news catalyst. Conviction trade paid off.",
    date: "2026-02-15",
    tags: ["News", "Strategy"],
  },
  {
    id: "j6",
    pair: "BTC/USDC",
    pnl: 567.2,
    emotion: "🚀",
    notes: "Caught the breakout above $98k. Trailed stop perfectly.",
    date: "2026-02-14",
    tags: ["Strategy"],
  },
  {
    id: "j7",
    pair: "ETH/USDC",
    pnl: -312.4,
    emotion: "😰",
    notes: "Overleveraged on a news trade. CPI print went opposite direction.",
    date: "2026-02-13",
    tags: ["News", "FOMO"],
  },
  {
    id: "j8",
    pair: "DOGE/USDC",
    pnl: 55.0,
    emotion: "😂",
    notes: "Meme coin momentum play. In and out in 3 minutes.",
    date: "2026-02-12",
    tags: ["FOMO"],
  },
  {
    id: "j9",
    pair: "SOL/USDC",
    pnl: 178.9,
    emotion: "🎯",
    notes: "Perfect entry on the 1H order block. Textbook setup.",
    date: "2026-02-11",
    tags: ["Strategy"],
  },
  {
    id: "j10",
    pair: "AVAX/USDC",
    pnl: -67.5,
    emotion: "😶",
    notes: "Stop hunted by 2 cents. Would have been a winner.",
    date: "2026-02-10",
    tags: ["Strategy"],
  },
];

// ─── Portfolio Stats ─────────────────────────────────────────
export interface PortfolioStats {
  winRate: number;
  totalFeesPaid: number;
  drawdown: number;
}

export const portfolioStats: PortfolioStats = {
  winRate: 63.5,
  totalFeesPaid: 1247.38,
  drawdown: 14.2,
};

// ─── VWAP / Dispersion for Smart Buy Button ──────────────────
export const vwapData = {
  price: "$145.20",
  dispersion: 0.68, // 0-1 normalized standard deviation
};
