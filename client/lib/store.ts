import { create } from "zustand";
import { IndexerTrade } from "../types/deriverse";
import { analyticsService } from "../services/analyticsService";
import { journalEntries } from "./mockData"; // Initial fallback

export type TabType = "Chart" | "Orderbook" | "Wallet";

interface DeriverseState {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;

    executionModalOpen: boolean;
    openExecutionModal: () => void;
    closeExecutionModal: () => void;

    journalPage: number;
    setJournalPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;

    isPortfolioActive: boolean;
    setIsPortfolioActive: (active: boolean) => void;

    aiInsightOpen: boolean;
    setAiInsightOpen: (open: boolean) => void;

    // Analytics State
    trades: IndexerTrade[];
    metrics: ReturnType<typeof analyticsService.computeMetrics>;
    setTrades: (trades: IndexerTrade[]) => void;
    refreshAnalytics: () => void;
}

// Initial metrics structure
const initialMetrics = analyticsService.computeMetrics([]);

export const useDeriverseStore = create<DeriverseState>((set, get) => ({
    activeTab: "Chart",
    setActiveTab: (tab) => set({ activeTab: tab }),

    executionModalOpen: false,
    openExecutionModal: () => set({ executionModalOpen: true }),
    closeExecutionModal: () => set({ executionModalOpen: false }),

    journalPage: 0,
    setJournalPage: (page) => set({ journalPage: page }),
    nextPage: () => set((state) => ({ journalPage: state.journalPage + 1 })),
    prevPage: () =>
        set((state) => ({
            journalPage: Math.max(0, state.journalPage - 1),
        })),

    isPortfolioActive: false,
    setIsPortfolioActive: (active) => set({ isPortfolioActive: active }),

    aiInsightOpen: false,
    setAiInsightOpen: (open) => set({ aiInsightOpen: open }),

    // Analytics Implementation
    trades: [], // In real app, fetch from indexer
    metrics: analyticsService.computeMetrics(journalEntries as any), // Seed with mock data initially
    setTrades: (trades) => {
        const metrics = analyticsService.computeMetrics(trades);
        set({ trades, metrics });
    },
    refreshAnalytics: () => {
        const { trades } = get();
        const metrics = analyticsService.computeMetrics(trades.length > 0 ? trades : journalEntries as any);
        set({ metrics });
    }
}));
