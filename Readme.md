<p align="center">
  <img src="./screenshots/logo.png" height="120"/>
</p>

<h1 align="center">Dominus Quant (DQuant)</h1>
<p align="center">
  Dominus Quant is a narrative-driven, AI-assisted crypto trading platform designed for real-time market insight and optional automated spot execution. Built as a personal project, it’s a proof-of-concept for **next-generation quant infrastructure**, combining behavioral analytics, distributed intelligence, and portfolio storytelling.
</p>





This project demonstrates what’s possible when **trading intelligence, narrative detection, and modular infrastructure** meet.

---

## 📸 Platform Screenshots

<div style="display:flex; overflow-x:auto; gap:12px; padding:10px 0;white-space: nowrap;">

  
  <img src="./screenshots/2.jpg" height="260"/>
  <img src="./screenshots/3.jpg" height="260"/>
  <img src="./screenshots/4.jpg" height="260"/>
  <img src="./screenshots/5.jpg" height="260"/>
</div>

<p align="center">
Scroll horizontally to view platform screenshots →
</p>

---

## Why DQuant Matters

Markets move on **narratives**, not just price.

Dominus Quant tracks:

- Ecosystem signals — tweets, hackathons, announcements  
- Market microstructure — liquidity shifts, volume spikes  
- Behavioral patterns — FOMO cycles, performance decay  

By combining these layers, DQuant gives traders actionable intelligence and provides automated pool participants a risk-managed execution engine.

---

## Core Product Features

### 1. Hybrid Trading Platform
- **Manual Mode:** Traders receive signals + confidence scores  
- **Automated Pool Mode:** Allocate capital and let the engine execute with guardrails  

### 2. Narrative Portfolio Analytics
- Converts trade data into story-driven insights  
- Identifies performance peaks and mistakes  
- AI-driven behavioral correction  

### 3. Deep AI Insights
- Execution timing analysis  
- Revenge trade detection  
- Overtrading warnings  
- Probabilistic trade scoring  

### 4. Trading Journal & Dashboard
- Automatic trade indexing  
- Visual trade replay  
- Key metrics: PnL, win rate, bias, session performance  

---

## System Architecture

```mermaid
graph TD
    subgraph "Frontend Layer (Next.js 16)"
        UI["UI Components (Radix, Tailwind)"]
        State["State Management (Zustand)"]
        Charts["Charts (Lightweight Charts, Recharts)"]
    end

    subgraph "Services Layer"
        DS["DexScreener Service (Market Data)"]
        AS["Analytics Service (Behavioral Metrics/AI)"]
        MS["Market Service (State & Polling)"]
        CA["Candle Aggregator"]
    end

    subgraph "On-Chain & Auth"
        PW["Privy Wallet Bridge"]
        SOL_CONN["Solana Web3 Connection"]
    end

    subgraph "External Providers"
        API["DexScreener API"]
        SOL_BC["Solana Blockchain"]
        PRV["Privy Auth"]
    end

    UI --> State
    UI --> Charts
    State --> MS
    MS --> DS
    MS --> CA
    DS --> API
    UI --> AS
    AS --> State
    UI --> PW
    PW --> PRV
    PW --> SOL_CONN
    SOL_CONN --> SOL_BC
```

---

Tech Stack

Frontend: Next.js 16, Tailwind CSS, Zustand

Charts: Lightweight Charts, Recharts

On-Chain: Solana Web3.js

Auth: Privy

AI Layer: Real-time behavioral analysis

Architecture: Modular, distributed-ready



---

Roadmap

Expand distributed signal layer

Add multi-chain support

Enhance AI behavioral modeling

Launch community-governed quant pool



---

Getting Started

git clone https://github.com/yourusername/dominus-quant.git
cd dominus-quant
npm install
npm run dev


---

License

MIT — open for experimentation and research.
