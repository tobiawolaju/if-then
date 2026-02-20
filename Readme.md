# 💎 TrueDex: Professional Trading Terminal & Analytics

**TrueDex** is a high-fidelity, on-chain trading dashboard built for the **Deriverse Ecosystem**. Designed for professional traders who demand both technical precision and psychological insight, TrueDex transforms raw Solana transaction data into a compelling trading narrative.

---

## 🚀 The Hackathon Pitch: Beyond the Dashboard

TrueDex was built to address the three pillars of a winning Deriverse submission: **Comprehensiveness**, **Accuracy**, and **Innovation**.

### 🎨 Emotional Storytelling (The "Spotify Wrapped" Layer)
Trading is as much about psychology as it is about price. TrueDex features a dynamic, "lyrics-style" portfolio review that narratively guides users through their trading performance. 
- **Session Alpha**: Detects your most profitable trading windows (London vs. NY).
- **Directional Bias**: Visualizes your Long/Short ratio as a personality trait.
- **Risk Resilience**: Narrates your recovery from max drawdown.

### 📊 Technical Rigor (Advanced Analytics)
Powered by a custom on-chain indexer, TrueDex computes 13+ critical KPIs directly from the **Deriverse Program ID** (`CDESjex...`):
- **Equity Curve & Drawdown**: High-fidelity Recharts visualizations of PnL velocity.
- **Fee Leakage Analysis**: Transparent tracking of protocol vs. gas fees.
- **Profit Factor & Expectancy**: Professional-grade statistical modeling of trade quality.
- **Win Rate & Trade Distribution**: Deep-dive metrics for strategy optimization.

### 📝 Smart Trading Journal
Every trade is automatically indexed and enriched with a high-performance **TradingView Lightweight Chart** snapshot.
- **Trade Playback**: See exactly what the market looked like at the moment of your entry.
- **Notes & Ethics**: Locally stored annotations (Privacy First) to track emotions and "Fat Finger" errors.

---

## 🛠️ Technical Architecture

TrueDex is a full-spectrum frontend solution designed for the Solana mainnet/devnet environment:

- **Frontend**: Next.js 16 (App Router) + Tailwind CSS (Abyss Dark Theme)
- **Charts**: `lightweight-charts` (Financial) + `recharts` (Analytics)
- **Auth & Wallet**: Privy (Embedded Wallets & Signer Bridge)
- **State**: Zustand (Reactive Metrics Engine)
- **On-Chain**: `@solana/web3.js` + Custom Deriverse Indexer
- **Animations**: Framer Motion (Spotify Wrapped UX)

---

## 📦 Setup & Installation

1. **Clone & Install**:
   ```bash
   git clone https://github.com/your-username/TrueDex.git
   cd TrueDex/client
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` based on your Deriverse environment requirements:
   ```env
   NEXT_PUBLIC_DERIVERSE_PROGRAM_ID=CDESjex4EDBKLwx9ZPzVbjiHEHatasb5fhSJZMzNfvw2
   NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
   ```

3. **Run Dev**:
   ```bash
   npm run dev
   ```

---

## 🔒 Privacy & Security

- **Local Annotations**: Your notes, strategies, and emotions are stored in **IndexedDB/LocalStorage**. They never touch a server.
- **On-Chain Transparency**: All performance data is derived purely from public blockchain data via the Deriverse Program ID.
- **Non-Custodial**: TrueDex never touches your private keys. All signing is handled via the secure Privy/Solana Web3.js bridge.

---

## 🏆 Submission Category
**Design & Develop a Comprehensive Trading Analytics Solution for Deriverse.**

*Created with ❤️ for the Deriverse community.*
