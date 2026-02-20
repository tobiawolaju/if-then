🧠 FULL SDK INTEGRATION SPEC

Privy + Deriverse v1 + Solana

1️⃣ AUTHENTICATION LAYER

You are using Privy.

Privy gives you:

Embedded wallet

Social login (optional)

Wallet connection abstraction

Signer object

You do NOT use wallet-adapter directly.

Privy provides:

wallet.address

wallet.signTransaction()

That’s enough for Deriverse SDK.

2️⃣ HIGH-LEVEL ARCHITECTURE
Frontend (Next.js App Router)
    ↓
Privy (Auth + Wallet)
    ↓
Deriverse SDK (@deriverse/kit)
    ↓
Solana RPC

No backend required (except optional AI route).

3️⃣ FOLDER STRUCTURE
/app
/components
/services
  ├── connection.ts
  ├── privyWalletBridge.ts
  ├── sdkClient.ts
  ├── marketService.ts
  ├── tradeService.ts
  ├── positionService.ts
  ├── journalIndexerService.ts
  ├── analyticsService.ts
  ├── subscriptionService.ts
/state
/types
/utils
4️⃣ CRITICAL LAYER: PRIVY → SDK BRIDGE

Privy wallet ≠ standard wallet adapter.

So we create:

privyWalletBridge.ts

This wraps Privy wallet into a format Deriverse SDK accepts.

Responsibilities:

Provide publicKey

Provide signTransaction

Provide signAllTransactions

Expose:

createPrivySigner(privyWallet) → DeriverseCompatibleWallet

This is the glue.

Without this, SDK won’t know how to sign.

5️⃣ SDK INITIALIZATION

sdkClient.ts:

Create Solana connection

Inject Privy signer

Initialize Deriverse SDK

Export singleton

Must support:

Devnet

Configurable RPC endpoint

Environment-based config

6️⃣ USER-SPECIFIC DATA FLOW

After login:

Privy authenticates

Extract wallet.address

Create SDK client with signer

Fetch:

getUserPositions()

getUserMargin()

getOpenOrders()

getTradeHistory() (if supported)

If trade history not supported:

Call:

journalIndexerService

7️⃣ JOURNAL INDEXER SPEC

If Deriverse SDK does not provide direct history endpoint:

journalIndexerService.ts:

Use Solana connection

getSignaturesForAddress(wallet)

Fetch parsed transactions

Filter for Deriverse Program ID

Parse logs for:

Entry

Exit

Size

Direction

Fee

Timestamp

Normalize into:

{
  id,
  market,
  side,
  entry,
  exit,
  size,
  pnl,
  fee,
  timestamp
}

Cache in local state.

Optional:
Persist in IndexedDB.

8️⃣ TRADE EXECUTION SPEC

tradeService.ts:

All write methods must return:

{
  status: "pending" | "confirmed" | "failed",
  signature?: string,
  error?: string
}

Lifecycle:

Submit transaction

Return signature

Listen via connection.onSignature

Update state on confirm

Refetch positions

Zero page reload.

9️⃣ REAL-TIME SUBSCRIPTIONS

subscriptionService.ts:

Subscribe to:

Account change

Order book updates

Position updates

Push updates into Zustand store.

Fallback to polling only if WebSocket fails.

🔟 ANALYTICS ENGINE

analyticsService.ts computes:

Win rate

Avg R

Max drawdown

Profit factor

Expectancy

Sharpe

Risk of ruin

Pure frontend.
Pure deterministic math.
No SDK dependency.

11️⃣ STATE MANAGEMENT

Use:

Zustand for trading state

React Query for data fetching

Derived selectors for KPIs

Never compute heavy analytics inside components.

12️⃣ SECURITY NOTES

Never expose Gemini API key

Use Next.js API route for AI summary

Never log private keys

Use read-only RPC where possible