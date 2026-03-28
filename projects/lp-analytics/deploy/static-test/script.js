const DAYS_IN_YEAR = 365.25;
const STORAGE_KEY = "lp-analytics-batch-snapshots-v1";
const MIN_USER_RANGE_WIDTH = 0.01;
const MAX_REASONABLE_DELTA_PCT = 500;

const pools = [
  { id: "eth-base-aerodrom", ecosystem: "ethereum", asset: "ETH/USDC", dex: "Aerodrom", network: "Base", feePct: 0.034, minRange: 1004.311, maxRange: 6515.6585, currentPrice: 2983.6, startLiquidityUsd: 52.7, currentLiquidity: 42.51, startedAt: "2025-12-26T11:08:00", seedFees: 2.11105 },
  { id: "eth-base-uniswap", ecosystem: "ethereum", asset: "ETH/USDC", dex: "Uniswap", network: "Base", feePct: 0.05, minRange: 1004.311, maxRange: 6515.6585, currentPrice: 2983.6, startLiquidityUsd: 52.7, currentLiquidity: 42.51, startedAt: "2025-12-26T11:08:00", seedFees: 1.76 },
  { id: "eth-arbitrum-uniswap", ecosystem: "ethereum", asset: "ETH/USDC", dex: "Uniswap", network: "Arbitrum", feePct: 0.05, minRange: 1004.311, maxRange: 6515.6585, currentPrice: 2983.6, startLiquidityUsd: 52.7, currentLiquidity: 42.51, startedAt: "2025-12-26T11:08:00", seedFees: 1.54 },
  { id: "weth-monad-uniswap-005", ecosystem: "ethereum", asset: "WETH/USDC", dex: "Uniswap", network: "Monad", feePct: 0.05, minRange: 1004.311, maxRange: 6515.6585, currentPrice: 2983.6, startLiquidityUsd: 52.7, currentLiquidity: 42.51, startedAt: "2025-12-26T11:08:00", seedFees: 1.6 },
  { id: "weth-monad-uniswap-03", ecosystem: "ethereum", asset: "WETH/USDC", dex: "Uniswap", network: "Monad", feePct: 0.3, minRange: 1000.3, maxRange: 6502.64, currentPrice: 2983.6, startLiquidityUsd: 52.7, currentLiquidity: 42.51, startedAt: "2025-12-26T11:08:00", seedFees: 2.21 },
  { id: "weth-bnb-uniswap", ecosystem: "ethereum", asset: "WETH/USDT", dex: "Uniswap", network: "BNB", feePct: 0.3, minRange: 1004.91, maxRange: 6513.04, currentPrice: 2983.6, startLiquidityUsd: 52.7, currentLiquidity: 42.51, startedAt: "2025-12-26T11:08:00", seedFees: 1.57 },
  { id: "cbbtc-base-aerodrom", ecosystem: "bitcoin", asset: "USDC/cbBTC", dex: "Aerodrom", network: "Base", feePct: 0.033, minRange: 58140, maxRange: 117647, currentPrice: 87429, startLiquidityUsd: 52.06, currentLiquidity: 52.06, startedAt: "2025-12-27T22:50:00", seedFees: 2.93947 },
  { id: "wbtc-arbitrum-uniswap", ecosystem: "bitcoin", asset: "WBTC/USDC", dex: "Uniswap", network: "Arbitrum", feePct: 0.05, minRange: 57806.3, maxRange: 117573, currentPrice: 87429, startLiquidityUsd: 52.1, currentLiquidity: 52.1, startedAt: "2025-12-27T22:50:00", seedFees: 2.2 },
  { id: "ausd-monad-uniswap", ecosystem: "bitcoin", asset: "AUSD/WBTC", dex: "Uniswap", network: "Monad", feePct: 0.05, minRange: 57806.3, maxRange: 117573, currentPrice: 87429, startLiquidityUsd: 52.06, currentLiquidity: 52.06, startedAt: "2025-12-27T22:50:00", seedFees: 2.1 },
  { id: "btcb-avax-uni", ecosystem: "bitcoin", asset: "BTC.B/USDC", dex: "Uniswap", network: "Avalanche", feePct: 0.3, minRange: 57806.3, maxRange: 117338, currentPrice: 87429, startLiquidityUsd: 52.01, currentLiquidity: 52.01, startedAt: "2025-12-27T22:50:00", seedFees: 2.7 },
  { id: "btcb-lfj-avax", ecosystem: "bitcoin", asset: "BTC.B/USDC", dex: "LFJ", network: "Avalanche", feePct: 0.05, minRange: 57814, maxRange: 117434, currentPrice: 87429, startLiquidityUsd: 51.54, currentLiquidity: 51.54, startedAt: "2025-12-27T22:50:00", seedFees: 2.279 },
  { id: "avax-uniswap", ecosystem: "avalanche", asset: "AVAX/USDC", dex: "Uniswap", network: "Avalanche", feePct: 0.05, minRange: 6.02136, maxRange: 90.0331, currentPrice: 25.57, startLiquidityUsd: 557, currentLiquidity: 557, startedAt: "2026-02-24T22:00:00", seedFees: 4.38 },
];

const sectionsOrder = [
  { key: "ethereum", label: "Ethereum Pools" },
  { key: "bitcoin", label: "Bitcoin Pools" },
  { key: "avalanche", label: "Avalanche Pools" },
];

function seedMarketPricesFromPools() {
  const bySymbol = { BTC: 0, ETH: 0, AVAX: 25.57, USDC: 1 };

  pools.forEach((pool) => {
    const symbol = getPoolQuoteSymbol(pool.asset);
    if (!bySymbol[symbol] && pool.currentPrice) {
      bySymbol[symbol] = pool.currentPrice;
    }
  });

  marketPrices = {
    ...marketPrices,
    ...bySymbol,
    updatedAt: new Date().toISOString(),
    source: "Pool fallback",
  };
}

const summaryGrid = document.getElementById("summaryGrid");
const sectionsStack = document.getElementById("sectionsStack");
const calculatorForm = document.getElementById("calculatorForm");
const calculatorMetrics = document.getElementById("calculatorMetrics");
const tokenCalculatorForm = document.getElementById("tokenCalculatorForm");
const tokenCalculatorMetrics = document.getElementById("tokenCalculatorMetrics");
const historyTable = document.getElementById("historyTable");
const toast = document.getElementById("toast");
const backupFileInput = document.getElementById("backupFileInput");
const poolModal = document.getElementById("poolModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalPoolTitle = document.getElementById("modalPoolTitle");
const modalPoolSubtitle = document.getElementById("modalPoolSubtitle");
const modalHistoryTable = document.getElementById("modalHistoryTable");
const navButtons = Array.from(document.querySelectorAll(".nav-button"));
const viewPanels = Array.from(document.querySelectorAll(".view"));

let selectedPoolId = "";
let modalPoolId = null;
let editingBatchId = null;
let batchDraftTotals = {};
let calculatorQuickKey = "ethereum";
let dashboardSortKey = "name";
let compareFromBatchId = null;
let compareToBatchId = null;
let currentCalculatorLiquidity = 1000;
let currentCalculatorRangeWidth = null;
let marketPrices = {
  BTC: 0,
  ETH: 0,
  AVAX: 0,
  USDC: 1,
  updatedAt: null,
  source: "Pool fallback",
};
let strategyManualState = {
  capital: 1000,
  width: 400,
  assetPct: 5,
  usdcPct: 95,
  calibration: {
    ethereum: { enabled: true, poolId: "eth-base-aerodrom", manualPriceMode: false, manualPrice: "" },
    bitcoin: { enabled: true, poolId: "wbtc-arbitrum-uniswap", manualPriceMode: false, manualPrice: "" },
    avalanche: { enabled: false, poolId: "avax-uniswap", manualPriceMode: false, manualPrice: "" },
  },
  allocations: {
    ethereum: 30,
    bitcoin: 70,
    avalanche: 0,
  },
};

let fearGreedState = {
  value: null,
  classification: null,
  updatedAt: null,
  source: "Alternative.me",
};

let tokenCalculatorState = {
  BTC: { amount: 0, mode: "auto", manualPrice: "" },
  ETH: { amount: 0, mode: "auto", manualPrice: "" },
  AVAX: { amount: 0, mode: "auto", manualPrice: "" },
  USDC: { amount: 0, mode: "auto", manualPrice: "1" },
  debt: 0,
};

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function round(value, digits = 2) {
  return Number(value.toFixed(digits));
}

function diffDays(left, right) {
  return (right - left) / 86400000;
}

function formatMoney(value, digits = 2) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function formatNumber(value, digits = 2) {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value);
}

function formatDays(value) {
  return `${formatNumber(value, 2)}d`;
}

function formatPercent(value, digits = 2) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value, digits)}%`;
}

function formatSignedMoney(value, digits = 2) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatMoney(Math.abs(value), digits)}`;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDateInputValue(isoString) {
  const date = new Date(isoString);
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function getPoolQuoteSymbol(asset) {
  const upper = asset.toUpperCase();
  if (upper.includes("AVAX")) {
    return "AVAX";
  }
  if (
    upper.includes("BTC") ||
    upper.includes("WBTC") ||
    upper.includes("CBBTC") ||
    upper.includes("BTC.B") ||
    upper.includes("AUSD/WBTC")
  ) {
    return "BTC";
  }
  if (upper.includes("ETH") || upper.includes("WETH")) {
    return "ETH";
  }
  return "USDC";
}

function getCurrentMarketPriceForPool(poolState) {
  const symbol = getPoolQuoteSymbol(poolState.asset);
  return marketPrices[symbol] || poolState.currentPrice || 0;
}

function getReferencePrice(poolState) {
  return Math.sqrt(poolState.minRange * poolState.maxRange);
}

function getDexLogoMarkup(dexName, network) {
  const key = `${dexName}`.toLowerCase();
  const net = `${network}`.toLowerCase();

  if (key.includes("aerodrom")) {
    return `
      <span class="dex-logo" aria-hidden="true">
        <img src="./Aerodrome.png" alt="" />
      </span>
    `;
  }

  if (key.includes("uniswap")) {
    return `
      <span class="dex-logo" aria-hidden="true">
        <img src="./uniswap.png" alt="" />
      </span>
    `;
  }

  if (key.includes("avalanche") || net.includes("lfj") || key.includes("lfj")) {
    return `
      <span class="dex-logo" aria-hidden="true">
        <img src="./LFJ_Logo.png" alt="" />
      </span>
    `;
  }

  return `
    <span class="dex-logo" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill="#223048"/>
        <circle cx="12" cy="12" r="4" fill="#9fb3d9"/>
      </svg>
    </span>
  `;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => toast.classList.remove("show"), 2600);
}

function saveBatches(batches) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
}

function readBatches() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildSeedBatches() {
  const currentAt = new Date("2026-03-25T15:27:00");
  const timestamps = [
    new Date(currentAt.getTime() - 2 * 86400000).toISOString(),
    new Date(currentAt.getTime() - 86400000).toISOString(),
    currentAt.toISOString(),
  ];

  const totalsByPool = {};
  pools.forEach((pool) => {
    const activeDays = diffDays(new Date(pool.startedAt), currentAt);
    const dailyFees = activeDays > 0 ? pool.seedFees / activeDays : 0;
    const previousFee = Math.max(pool.seedFees - dailyFees, 0);
    const olderFee = Math.max(previousFee - dailyFees, 0);
    totalsByPool[pool.id] = [round(olderFee, 5), round(previousFee, 5), round(pool.seedFees, 5)];
  });

  return timestamps.map((snapshotAt, index) => ({
    id: createId("batch"),
    snapshotAt,
    totals: Object.fromEntries(
      pools.map((pool) => [pool.id, totalsByPool[pool.id][index]])
    ),
  }));
}

function normalizeBatches(batches) {
  return (Array.isArray(batches) ? batches : [])
    .map((batch) => ({
      id: batch.id || createId("batch"),
      snapshotAt: batch.snapshotAt,
      totals: Object.fromEntries(
        pools.map((pool) => [pool.id, Number(batch.totals?.[pool.id])])
      ),
    }))
    .sort((left, right) => new Date(left.snapshotAt) - new Date(right.snapshotAt));
}

let batchSnapshots = normalizeBatches(readBatches() || buildSeedBatches());
saveBatches(batchSnapshots);

function getSortedBatches() {
  return [...batchSnapshots].sort(
    (left, right) => new Date(left.snapshotAt) - new Date(right.snapshotAt)
  );
}

function ensureComparisonSelection() {
  const batches = getSortedBatches();
  if (!batches.length) {
    compareFromBatchId = null;
    compareToBatchId = null;
    return;
  }

  const hasFrom = batches.some((batch) => batch.id === compareFromBatchId);
  const hasTo = batches.some((batch) => batch.id === compareToBatchId);

  if (!hasFrom) {
    compareFromBatchId = batches[0].id;
  }

  if (!hasTo) {
    compareToBatchId = batches[batches.length - 1].id;
  }

  if (compareFromBatchId === compareToBatchId && batches.length > 1) {
    compareToBatchId = batches[batches.length - 1].id;
  }
}

function getComparisonBatches() {
  ensureComparisonSelection();
  const batches = getSortedBatches();
  const fromBatch = batches.find((batch) => batch.id === compareFromBatchId) || batches[0] || null;
  let toBatch =
    batches.find((batch) => batch.id === compareToBatchId) || batches[batches.length - 1] || null;

  if (fromBatch && toBatch && new Date(fromBatch.snapshotAt) > new Date(toBatch.snapshotAt)) {
    return { fromBatch: toBatch, toBatch: fromBatch };
  }

  return { fromBatch, toBatch };
}

function validateBatchSeries(batches) {
  const sorted = [...batches].sort(
    (left, right) => new Date(left.snapshotAt) - new Date(right.snapshotAt)
  );

  for (const batch of sorted) {
    if (!batch.snapshotAt || Number.isNaN(new Date(batch.snapshotAt).getTime())) {
      return { valid: false, message: "Snapshot date is invalid.", batches: sorted };
    }
    for (const pool of pools) {
      const total = Number(batch.totals?.[pool.id]);
      if (!Number.isFinite(total) || total < 0) {
        return { valid: false, message: `Invalid snapshot total for ${pool.asset} / ${pool.network}.`, batches: sorted };
      }
    }
  }

  for (let i = 1; i < sorted.length; i += 1) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    for (const pool of pools) {
      const prevTotal = Number(prev.totals?.[pool.id]);
      const currTotal = Number(curr.totals?.[pool.id]);
      if (currTotal < prevTotal) {
        return { valid: false, message: `Snapshot totals cannot decrease for ${pool.asset} / ${pool.network}.`, batches: sorted };
      }
      if (prevTotal > 0) {
        const deltaPct = ((currTotal - prevTotal) / prevTotal) * 100;
        if (deltaPct > MAX_REASONABLE_DELTA_PCT) {
          return { valid: false, message: `Suspicious snapshot jump for ${pool.asset} / ${pool.network}.`, batches: sorted };
        }
      }
    }
  }

  return { valid: true, batches: sorted };
}

function replaceBatches(nextBatches) {
  batchSnapshots = nextBatches;
  saveBatches(batchSnapshots);
  ensureComparisonSelection();
}

async function fetchBinancePrices() {
  const symbols = ["BTCUSDT", "ETHUSDT", "AVAXUSDT"];
  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        if (!response.ok) {
          throw new Error(`Binance price error: ${symbol}`);
        }
        return response.json();
      })
    );

    const nextPrices = {
      BTC: Number(results.find((item) => item.symbol === "BTCUSDT")?.price) || marketPrices.BTC,
      ETH: Number(results.find((item) => item.symbol === "ETHUSDT")?.price) || marketPrices.ETH,
      AVAX: Number(results.find((item) => item.symbol === "AVAXUSDT")?.price) || marketPrices.AVAX,
      USDC: 1,
      updatedAt: new Date().toISOString(),
      source: "Binance API",
    };

    marketPrices = nextPrices;
    if (document.querySelector('[data-view-panel="calculator"].view-active')) {
      renderCalculator();
    }
  } catch {
    if (!marketPrices.updatedAt) {
      seedMarketPricesFromPools();
    }
  }
}

function buildBackupPayload() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    poolIds: pools.map((pool) => pool.id),
    batches: getSortedBatches(),
  };
}

function downloadBackup() {
  const payload = buildBackupPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  anchor.href = url;
  anchor.download = `lp-analytics-backup-${stamp}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast("Бэкап снапшотов сохранён.");
}

function validateBackupPayload(payload) {
  if (!payload || !Array.isArray(payload.batches)) {
    return { valid: false, message: "Некорректный файл бэкапа." };
  }

  const normalized = normalizeBatches(payload.batches);
  if (!normalized.length) {
    return { valid: false, message: "В бэкапе нет снапшотов." };
  }

  for (const batch of normalized) {
    if (!batch.snapshotAt || Number.isNaN(new Date(batch.snapshotAt).getTime())) {
      return { valid: false, message: "В бэкапе есть снапшот с некорректной датой." };
    }

    for (const pool of pools) {
      if (!Number.isFinite(batch.totals[pool.id])) {
        return {
          valid: false,
          message: `В бэкапе отсутствует значение для ${pool.asset} / ${pool.network}.`,
        };
      }
    }
  }

  return { valid: true, batches: normalized };
}

async function restoreBackupFromFile(file) {
  try {
    const text = await file.text();
    const payload = JSON.parse(text);
    const validation = validateBackupPayload(payload);
    if (!validation.valid) {
      showToast(validation.message);
      return;
    }

    replaceBatches(validation.batches);
    editingBatchId = null;
    resetBatchDraft();
    renderAll();
    showToast("Бэкап восстановлен.");
  } catch {
    showToast("Не удалось прочитать файл бэкапа.");
  } finally {
    backupFileInput.value = "";
  }
}

function getPoolSnapshots(poolId) {
  return getSortedBatches().map((batch) => ({
    id: batch.id,
    snapshotAt: batch.snapshotAt,
    totalFees: batch.totals[poolId],
  }));
}

function getPoolState(pool) {
  const snapshots = getPoolSnapshots(pool.id);
  const latest = snapshots[snapshots.length - 1];
  const previous = snapshots[snapshots.length - 2] || null;
  const latestDate = new Date(latest.snapshotAt);
  const { fromBatch, toBatch } = getComparisonBatches();
  const compareFromValue = fromBatch ? fromBatch.totals[pool.id] : null;
  const compareToValue = toBatch ? toBatch.totals[pool.id] : null;
  const compareDeltaPct =
    fromBatch && toBatch && Number.isFinite(compareFromValue) && compareFromValue !== 0
      ? ((compareToValue - compareFromValue) / compareFromValue) * 100
      : 0;
  const comparePeriodDays =
    fromBatch && toBatch
      ? diffDays(new Date(fromBatch.snapshotAt), new Date(toBatch.snapshotAt))
      : 0;
  const daysActive = diffDays(new Date(pool.startedAt), latestDate);
  const apr =
    pool.startLiquidityUsd > 0 && daysActive > 0
      ? (latest.totalFees / pool.startLiquidityUsd / daysActive) * DAYS_IN_YEAR * 100
      : 0;
  const deltaPct =
    previous && previous.totalFees > 0
      ? ((latest.totalFees - previous.totalFees) / previous.totalFees) * 100
      : 0;
  const periodDays = previous
    ? diffDays(new Date(previous.snapshotAt), new Date(latest.snapshotAt))
    : 0;

  return {
    ...pool,
    range: pool.maxRange - pool.minRange,
    latest,
    previous,
    snapshots,
    snapshotCount: snapshots.length,
    daysActive,
    apr,
    deltaPct,
    periodDays,
    compareDeltaPct,
    comparePeriodDays,
  };
}

function getAllPoolStates() {
  return pools.map(getPoolState);
}

function groupStates() {
  const grouped = {};
  getAllPoolStates().forEach((state) => {
    if (!grouped[state.ecosystem]) {
      grouped[state.ecosystem] = [];
    }
    grouped[state.ecosystem].push(state);
  });

  return sectionsOrder.map((section) => ({
    ...section,
    pools: sortSectionPools(grouped[section.key] || []),
  }));
}

function sortSectionPools(poolsForSection) {
  const items = [...poolsForSection];
  if (dashboardSortKey === "apr") {
    return items.sort((a, b) => {
      if (b.apr !== a.apr) return b.apr - a.apr;
      return a.asset.localeCompare(b.asset) || a.network.localeCompare(b.network);
    });
  }
  if (dashboardSortKey === "delta") {
    return items.sort((a, b) => {
      if (b.compareDeltaPct !== a.compareDeltaPct) return b.compareDeltaPct - a.compareDeltaPct;
      return a.asset.localeCompare(b.asset) || a.network.localeCompare(b.network);
    });
  }
  return items;
}

function getLatestBatch() {
  const batches = getSortedBatches();
  return batches[batches.length - 1] || null;
}

function getMissingPoolLabels(totals) {
  return pools
    .filter((pool) => totals[pool.id] === null || !Number.isFinite(totals[pool.id]))
    .map((pool) => `${pool.asset} / ${pool.network}`);
}

function addBatch(snapshotAt, totals) {
  const candidate = {
    id: createId("batch"),
    snapshotAt,
    totals,
  };
  const validation = validateBatchSeries([...getSortedBatches(), candidate]);
  if (!validation.valid) {
    showToast(validation.message);
    return false;
  }
  replaceBatches(validation.batches);
  renderAll();
  showToast("Общий снапшот сохранён.");
  return true;
}

function updateBatch(batchId, snapshotAt, totals) {
  const updated = getSortedBatches().map((batch) =>
    batch.id === batchId ? { ...batch, snapshotAt, totals } : batch
  );
  const validation = validateBatchSeries(updated);
  if (!validation.valid) {
    showToast(validation.message);
    return false;
  }
  replaceBatches(validation.batches);
  renderAll();
  showToast("Общий снапшот обновлён.");
  return true;
}

function deleteLastBatch() {
  const batches = getSortedBatches();
  if (batches.length <= 1) {
    showToast("Нельзя удалить последний общий снапшот.");
    return false;
  }
  replaceBatches(batches.slice(0, -1));
  editingBatchId = null;
  renderAll();
  showToast("Последний общий снапшот удалён.");
  return true;
}

function resetBatchDraft() {
  const latestBatch = getLatestBatch();
  const editingBatch = editingBatchId
    ? getSortedBatches().find((batch) => batch.id === editingBatchId)
    : null;
  const sourceBatch = editingBatch || latestBatch;
  batchDraftTotals = Object.fromEntries(
    pools.map((pool) => [pool.id, sourceBatch.totals[pool.id]])
  );
}

function getBatchOptionLabel(batch, index) {
  return `#${index + 1} - ${formatDateTime(batch.snapshotAt)}`;
}



function getPoolDisplayOption(pool) {
  return `${pool.asset} | ${pool.dex} | ${pool.network} | ${formatNumber(pool.feePct, 3)}%`;
}

function getPoolDisplayName(state) {
  const hasDuplicateVisualName = pools.some(
    (pool) =>
      pool.id !== state.id &&
      pool.ecosystem === state.ecosystem &&
      pool.network === state.network &&
      pool.asset === state.asset &&
      pool.dex === state.dex
  );

  return hasDuplicateVisualName
    ? `${state.network} ${formatNumber(state.feePct, 3)}%`
    : state.network;
}

function setDraftValue(poolId, rawValue) {
  batchDraftTotals[poolId] = rawValue.trim() === "" ? null : Number(rawValue);
}

function saveDraftBatch() {
  const missing = getMissingPoolLabels(batchDraftTotals);
  if (missing.length) {
    showToast(`Пожалуйста, занесите все пулы. Не заполнены: ${missing.join(", ")}`);
    return;
  }

  const snapshotAt = new Date().toISOString();
  if (editingBatchId) {
    if (updateBatch(editingBatchId, snapshotAt, { ...batchDraftTotals })) {
      editingBatchId = null;
      resetBatchDraft();
    }
    return;
  }

  addBatch(snapshotAt, { ...batchDraftTotals });
}

function bindSectionControls() {
  document.getElementById("saveBatchInline")?.addEventListener("click", saveDraftBatch);
  document.getElementById("editLastBatchInline")?.addEventListener("click", () => {
    editingBatchId = getLatestBatch().id;
    resetBatchDraft();
    renderSections();
  });
  document.getElementById("deleteLastBatchInline")?.addEventListener("click", () => {
    deleteLastBatch();
    resetBatchDraft();
  });
  document.getElementById("backupSnapshotsInline")?.addEventListener("click", downloadBackup);
  document.getElementById("restoreSnapshotsInline")?.addEventListener("click", () => {
    backupFileInput.click();
  });
  document.getElementById("cancelBatchEditInline")?.addEventListener("click", () => {
    editingBatchId = null;
    resetBatchDraft();
    renderSections();
  });

  Array.from(document.querySelectorAll("[data-batch-input]")).forEach((input) => {
    input.addEventListener("input", () => {
      setDraftValue(input.dataset.batchInput, input.value);
    });
  });

  Array.from(document.querySelectorAll("[data-sort-key]")).forEach((button) => {
    button.addEventListener("click", () => {
      dashboardSortKey = button.dataset.sortKey;
      renderSections();
    });
  });

  document.getElementById("compareFromSelect")?.addEventListener("change", (event) => {
    compareFromBatchId = event.target.value;
    renderAll();
  });

  document.getElementById("compareToSelect")?.addEventListener("change", (event) => {
    compareToBatchId = event.target.value;
    renderAll();
  });
}

function renderSummary() {
  const states = getAllPoolStates();
  const totalFees = states.reduce((sum, state) => sum + state.latest.totalFees, 0);
  const avgApr = states.reduce((sum, state) => sum + state.apr, 0) / states.length;

  summaryGrid.innerHTML = [
    { label: "Active pools", value: states.length, text: "Все пулы из Excel загружены" },
    { label: "Total fees collected", value: formatMoney(totalFees, 0), text: "Сумма по последнему общему снапшоту" },
    { label: "Avg. APR", value: `${formatNumber(avgApr, 2)}%`, text: "Пересчитывается по каждому пулу", accent: true },
  ]
    .map(
      (card) => `
        <article class="summary-card ${card.accent ? "accent" : ""}">
          <span>${card.label}</span>
          <strong>${card.value}</strong>
          <p>${card.text}</p>
        </article>
      `
    )
    .join("");
}

function renderSections() {
  const grouped = groupStates();
  const latestBatch = getLatestBatch();
  const batches = getSortedBatches();
  const { fromBatch, toBatch } = getComparisonBatches();
  const comparisonComment =
    fromBatch && toBatch
      ? `Delta compares snapshots from ${formatDateTime(fromBatch.snapshotAt)} to ${formatDateTime(
          toBatch.snapshotAt
        )}.`
      : "";

  sectionsStack.innerHTML = grouped
    .map(
      (section, index) => `
        <section class="section-shell">
          <div class="section-head">
            <div class="section-head-left">
              ${
                index === 0
                  ? `
                    <div class="compare-controls">
                      <label class="compare-field">
                        <span class="compare-label">Delta from</span>
                        <select class="compare-select" id="compareFromSelect">
                          ${batches
                            .map(
                              (batch, batchIndex) => `
                                <option value="${batch.id}" ${
                                  fromBatch?.id === batch.id ? "selected" : ""
                                }>${getBatchOptionLabel(batch, batchIndex)}</option>
                              `
                            )
                            .join("")}
                        </select>
                      </label>
                      <label class="compare-field">
                        <span class="compare-label">Delta to</span>
                        <select class="compare-select" id="compareToSelect">
                          ${batches
                            .map(
                              (batch, batchIndex) => `
                                <option value="${batch.id}" ${
                                  toBatch?.id === batch.id ? "selected" : ""
                                }>${getBatchOptionLabel(batch, batchIndex)}</option>
                              `
                            )
                            .join("")}
                        </select>
                      </label>
                    </div>
                    <div class="comparison-text">${comparisonComment}</div>
                  `
                  : ""
              }
              <div class="section-heading">
                <h3>${section.label}</h3>
                <span class="pool-count">${section.pools.length} pools</span>
              </div>
            </div>
            <div class="section-controls">
              <div class="last-update">Last update: ${formatDateTime(latestBatch.snapshotAt)}</div>
              ${
                index === 0
                  ? `
                    <div class="batch-actions">
                      <button class="mini-button" type="button" id="saveBatchInline">${
                        editingBatchId ? "Save batch changes" : "Save batch snapshot"
                      }</button>
                      <button class="mini-button" type="button" id="editLastBatchInline">Edit last batch</button>
                      <button class="mini-button" type="button" id="deleteLastBatchInline">Delete last batch</button>
                      <button class="mini-button" type="button" id="backupSnapshotsInline">Backup</button>
                      <button class="mini-button" type="button" id="restoreSnapshotsInline">Restore</button>
                      ${
                        editingBatchId
                          ? '<button class="mini-button" type="button" id="cancelBatchEditInline">Cancel edit</button>'
                          : ""
                      }
                    </div>
                    <div class="warning-text">Все поля New Snapshot ($) должны быть заполнены.</div>
                  `
                  : ""
              }
            </div>
          </div>
          <div class="pool-list">
            <div class="table-head">
              <span>
                <button class="sortable-head ${dashboardSortKey === "name" ? "active" : ""}" type="button" data-sort-key="name">
                  Pool Name
                  <span class="sort-arrow">↺</span>
                </button>
              </span>
              <span>Days Active</span>
              <span>Total Fees</span>
              <span>
                <button class="sortable-head ${dashboardSortKey === "apr" ? "active" : ""}" type="button" data-sort-key="apr">
                  APR Start
                  <span class="sort-arrow">↑</span>
                </button>
              </span>
              <span>
                <button class="sortable-head ${dashboardSortKey === "delta" ? "active" : ""}" type="button" data-sort-key="delta">
                  Delta (%)
                  <span class="sort-arrow">↑</span>
                </button>
              </span>
              <span>New Snapshot ($)</span>
            </div>
            ${section.pools
              .map(
                (state) => {
                  const maxApr = Math.max(...section.pools.map((pool) => pool.apr));
                  const maxDelta = Math.max(...section.pools.map((pool) => pool.compareDeltaPct));
                  const aprClass = state.apr === maxApr ? "metric-highlight" : "";
                  const deltaClass = state.compareDeltaPct === maxDelta ? "metric-highlight" : "";

                  return `
                  <article class="pool-row">
                    <div>
                      <div class="pool-title-top">
                        <span class="dex-badge">
                          ${getDexLogoMarkup(state.dex, state.network)}
                          <span class="dex-name">${state.dex}</span>
                        </span>
                        <span class="snap-badge">${state.snapshotCount} snaps</span>
                        <span class="pair-badge">${state.asset} ${state.feePct}%</span>
                      </div>
                      <div class="pool-name">${getPoolDisplayName(state)}</div>
                      <div class="pool-meta">
                        Range: ${formatNumber(state.minRange, 4)} - ${formatNumber(state.maxRange, 4)}
                        | Start liquidity: ${formatMoney(state.startLiquidityUsd)}
                      </div>
                      <button class="manage-button" type="button" data-manage-pool="${state.id}">
                        View history
                      </button>
                    </div>
                    <div class="pool-metric">
                      <span>Days active</span>
                      <strong>${formatDays(state.daysActive)}</strong>
                    </div>
                    <div class="pool-metric">
                      <span>Total fees</span>
                      <strong>${formatMoney(state.latest.totalFees)}</strong>
                    </div>
                    <div class="pool-metric">
                      <span>APR start</span>
                      <strong class="${aprClass}">${formatNumber(state.apr, 2)}%</strong>
                    </div>
                    <div class="pool-metric">
                      <span>Delta (%)</span>
                      <strong class="${deltaClass}">${formatPercent(state.compareDeltaPct, 2)}</strong>
                      <small>Period: ${formatNumber(state.comparePeriodDays, 0)}d</small>
                    </div>
                    <div>
                      <input
                        class="snapshot-input"
                        type="number"
                        step="0.00001"
                        min="0"
                        data-batch-input="${state.id}"
                        value="${
                          batchDraftTotals[state.id] === null || batchDraftTotals[state.id] === undefined
                            ? ""
                            : batchDraftTotals[state.id]
                        }"
                        placeholder="New total fees..."
                      />
                      <div class="snapshot-required">Required for all pools</div>
                    </div>
                  </article>
                `;
                }
              )
              .join("")}
          </div>
        </section>
      `
    )
    .join("");

  Array.from(document.querySelectorAll("[data-manage-pool]")).forEach((button) => {
    button.addEventListener("click", () => openPoolModal(button.dataset.managePool));
  });
  bindSectionControls();
}

function validateCalculatorInputs(liquidity, rangeWidth) {
  if (!Number.isFinite(liquidity) || liquidity <= 0) {
    return { valid: false, message: "Liquidity must be greater than 0." };
  }
  if (!Number.isFinite(rangeWidth) || rangeWidth < MIN_USER_RANGE_WIDTH) {
    return { valid: false, message: `Range width must be at least ${MIN_USER_RANGE_WIDTH}.` };
  }
  return { valid: true };
}

function renderCalculatorMetrics(state) {
  const feesPerDay = state.projectedDailyFees;
  const weeklyFees = feesPerDay * 7;
  const monthlyFees = feesPerDay * 30.4;
  const annualizedFees = feesPerDay * DAYS_IN_YEAR;

  calculatorMetrics.innerHTML = [
    { label: "Estimated daily fees", value: formatMoney(feesPerDay, 2), hero: true },
    { label: "Estimated APR", value: `${formatNumber(state.projectedApr, 2)}%`, heroAccent: true },
    { label: "Range-based multiplier", value: `${formatNumber(state.yieldMultiplier, 2)}x vs ref pool` },
    { label: "Historical daily fees (window)", value: formatMoney(state.historicalDailyFees, 4) },
    { label: "Reference liquidity used in model", value: formatMoney(state.referenceLiquidity, 2) },
    { label: "Current market price", value: formatMoney(state.currentMarketPrice, 2) },
    { label: "Reference price", value: formatMoney(state.referencePrice, 2) },
    { label: "Price scale", value: `${formatNumber(state.priceScale, 3)}x` },
    { label: "Scaled ref range", value: formatNumber(state.scaledReferenceRange, 2) },
    { label: "Relative range", value: `${formatNumber(state.relativeRangePct, 2)}% of price` },
    { label: "7-day est.", value: formatMoney(weeklyFees, 2) },
    { label: "Monthly est.", value: formatMoney(monthlyFees, 2) },
    { label: "Annualized fees", value: formatMoney(annualizedFees, 2) },
  ]
    .map(
      (metric) => `
        <div class="metric-card ${metric.hero ? "hero" : ""} ${metric.heroAccent ? "hero-accent" : ""}">
          <span>${metric.label}</span>
          <strong>${metric.value}</strong>
        </div>
      `
    )
      .join("");
}

function renderCalculator() {
  const states = getAllPoolStates();
  const quickBest = {
    ethereum: [...states].filter((state) => state.ecosystem === "ethereum").sort((a, b) => b.apr - a.apr)[0],
    bitcoin: [...states].filter((state) => state.ecosystem === "bitcoin").sort((a, b) => b.apr - a.apr)[0],
    avalanche: [...states].filter((state) => state.ecosystem === "avalanche").sort((a, b) => b.apr - a.apr)[0],
  };

  const ecosystemPools = states.filter((state) => state.ecosystem === calculatorQuickKey);
  const bestPoolForCurrentEcosystem = quickBest[calculatorQuickKey] || ecosystemPools[0] || states[0];
  const selectedInsideEcosystem =
    ecosystemPools.find((state) => state.id === selectedPoolId) || bestPoolForCurrentEcosystem;
  const selected = selectedInsideEcosystem || states[0];
  selectedPoolId = selected.id;

  const referenceRange = selected.range;
  const defaultRange = round(Math.max(referenceRange * 0.0544, referenceRange * 0.02, 1), 2);
  if (currentCalculatorRangeWidth === null) {
    currentCalculatorRangeWidth = defaultRange;
  }

  const projection = projectCalculatorState(
    selected,
    Number(currentCalculatorLiquidity) || 0,
    Number(currentCalculatorRangeWidth) || defaultRange
  );

  calculatorForm.innerHTML = `
    <div class="field">
      <span class="input-label">Quick select top reference pool</span>
      <div class="quick-select">
        <button class="quick-button ${calculatorQuickKey === "ethereum" ? "active" : ""}" type="button" data-quick-pool="ethereum">ETH pool</button>
        <button class="quick-button ${calculatorQuickKey === "bitcoin" ? "active" : ""}" type="button" data-quick-pool="bitcoin">BTC pool</button>
        <button class="quick-button ${calculatorQuickKey === "avalanche" ? "active" : ""}" type="button" data-quick-pool="avalanche">AVAX pool</button>
      </div>
    </div>
      <label class="field">
        <span class="input-label">Manual reference pool</span>
        <select class="calculator-select" name="poolId">
        ${ecosystemPools
          .map(
            (state) => `<option value="${state.id}" ${state.id === selectedPoolId ? "selected" : ""}>${state.asset} | ${state.dex} | ${getPoolDisplayName(state)}</option>`
          )
          .join("")}
      </select>
    </label>
    <div class="field-hint">Reference APR: ${formatNumber(selected.apr, 2)}% | Historical daily fees (selected window): ${formatMoney(
      projection.historicalDailyFees,
      4
    )}</div>
    <div class="field-hint">Reference range: ${formatNumber(referenceRange, 2)} | Reference liquidity used in model: ${formatMoney(
      selected.startLiquidityUsd,
      2
    )} | Price source: ${marketPrices.source}</div>
    <div class="field-hint warning-note">This is a simplified estimate based on a reference pool and historical fees. It does not model time in range, price path, changing competition, or out-of-range probability.</div>
    <div class="field-row">
      <label class="field">
        <span class="input-label">Your liquidity (USD)</span>
        <input class="calculator-input" type="number" step="any" min="0" name="liquidity" value="${currentCalculatorLiquidity}" />
      </label>
      <label class="field">
        <span class="input-label">Your range width (price units)</span>
        <input class="calculator-input" type="number" step="any" min="0" name="rangeWidth" value="${currentCalculatorRangeWidth}" />
      </label>
    </div>
    <div class="field-hint">Reference price = sqrt(min range * max range). Scaled range = ref range * price scale.</div>
    <div class="field-hint">Range-based multiplier = scaled ref range / your input range. Narrower ranges increase estimated yield, but also increase real-world out-of-range risk, which this calculator does not model.</div>
    <div class="field-hint">Minimum allowed input range width: ${formatNumber(MIN_USER_RANGE_WIDTH, 2)}</div>
    <div class="calculator-actions">
      <button class="calculator-button" type="submit">Project yield</button>
    </div>
  `;

  historyTable.innerHTML = `
    <thead>
      <tr>
        <th>Snapshot time</th>
        <th>Total fees</th>
        <th>Delta vs prev</th>
      </tr>
    </thead>
    <tbody>
      ${selected.snapshots
        .slice()
        .reverse()
        .map((snapshot, index, reversed) => {
          const older = reversed[index + 1];
          const delta =
            older && older.totalFees > 0
              ? ((snapshot.totalFees - older.totalFees) / older.totalFees) * 100
              : 0;
          return `
            <tr>
              <td>${formatDateTime(snapshot.snapshotAt)}</td>
              <td>${formatMoney(snapshot.totalFees)}</td>
              <td>${older ? formatPercent(delta, 2) : "-"}</td>
            </tr>
          `;
        })
        .join("")}
    </tbody>
  `;

  renderCalculatorMetrics(projection);
  renderTokenCalculator();

  Array.from(document.querySelectorAll("[data-quick-pool]")).forEach((button) => {
    button.addEventListener("click", () => {
      calculatorQuickKey = button.dataset.quickPool;
      selectedPoolId = quickBest[calculatorQuickKey].id;
      currentCalculatorRangeWidth = null;
      renderCalculator();
    });
  });

  calculatorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(calculatorForm);
    selectedPoolId = form.get("poolId");
    const chosen = ecosystemPools.find((state) => state.id === selectedPoolId) || selected;
    const liquidity = Number(form.get("liquidity")) || 0;
    const rangeWidth = Number(form.get("rangeWidth"));
    const validation = validateCalculatorInputs(liquidity, rangeWidth);
    if (!validation.valid) {
      showToast(validation.message);
      return;
    }
    currentCalculatorLiquidity = liquidity;
    currentCalculatorRangeWidth = rangeWidth;
    renderCalculatorMetrics({
      ...projectCalculatorState(chosen, liquidity, rangeWidth),
    });
    renderTokenCalculator();
  });

  calculatorForm.querySelector('[name="poolId"]').addEventListener("change", (event) => {
    selectedPoolId = event.target.value;
    currentCalculatorRangeWidth = null;
    renderCalculator();
  });
}

function projectCalculatorState(poolState, liquidity, rangeWidth) {
  const { fromBatch, toBatch } = getComparisonBatches();
  const fromValue = fromBatch ? fromBatch.totals[poolState.id] : 0;
  const toValue = toBatch ? toBatch.totals[poolState.id] : poolState.latest.totalFees;
  const compareDays =
    fromBatch && toBatch
      ? Math.max(diffDays(new Date(fromBatch.snapshotAt), new Date(toBatch.snapshotAt)), 1 / 24)
      : Math.max(poolState.periodDays || poolState.daysActive, 1 / 24);
  const historicalDailyFees = (toValue - fromValue) / compareDays;
  const referenceLiquidity = Math.max(poolState.startLiquidityUsd, 0.0001);
  const currentMarketPrice = getCurrentMarketPriceForPool(poolState);
  const referencePrice = getReferencePrice(poolState);
  const priceScale = referencePrice > 0 ? currentMarketPrice / referencePrice : 1;
  const referenceRange = poolState.range;
  const scaledReferenceRange = referenceRange * priceScale;
  const safeRange = Math.max(rangeWidth, MIN_USER_RANGE_WIDTH);
  const yieldMultiplier = scaledReferenceRange / safeRange;
  const projectedDailyFees =
    historicalDailyFees * (liquidity / referenceLiquidity) * yieldMultiplier;
  const projectedApr =
    liquidity > 0 ? (projectedDailyFees * DAYS_IN_YEAR / liquidity) * 100 : 0;
  const relativeRangePct = currentMarketPrice > 0 ? (rangeWidth / currentMarketPrice) * 100 : 0;

  return {
    ...poolState,
    referenceRange,
    scaledReferenceRange,
    historicalDailyFees,
    referenceLiquidity,
    currentMarketPrice,
    referencePrice,
    priceScale,
    projectedApr,
    projectedDailyFees,
    yieldMultiplier,
    relativeRangePct,
  };
}

function getTokenEffectivePrice(symbol) {
  const item = tokenCalculatorState[symbol];
  if (item.mode === "manual" && Number(item.manualPrice) > 0) {
    return Number(item.manualPrice);
  }
  return marketPrices[symbol] || 0;
}

function buildTokenRows() {
  return ["BTC", "ETH", "AVAX", "USDC"]
    .map((symbol) => {
      const item = tokenCalculatorState[symbol];
      const effectivePrice = getTokenEffectivePrice(symbol);
      const livePrice = marketPrices[symbol] || 0;
      return `
        <div class="token-row">
          <div class="token-symbol">${symbol}</div>
          <label class="field">
            <span class="input-label">Amount</span>
            <input class="calculator-input" type="number" step="0.00000001" min="0" data-token-amount="${symbol}" value="${item.amount}" />
          </label>
          <label class="field">
            <span class="input-label">Price mode</span>
            <select class="calculator-select" data-token-mode="${symbol}">
              <option value="auto" ${item.mode === "auto" ? "selected" : ""}>Live</option>
              <option value="manual" ${item.mode === "manual" ? "selected" : ""}>Manual</option>
            </select>
          </label>
          <label class="field">
            <span class="input-label">Price</span>
            <input class="calculator-input" type="number" step="any" min="0" data-token-price="${symbol}" value="${
              item.mode === "manual" ? item.manualPrice : livePrice
            }" ${item.mode === "auto" ? "disabled" : ""} />
          </label>
          <div class="token-inline-note">
            Source: ${item.mode === "manual" ? "Manual override" : marketPrices.source}<br/>
            Effective: ${formatMoney(effectivePrice, 4)}
          </div>
        </div>
      `;
    })
    .join("");
}

function renderTokenCalculatorMetrics() {
  const symbols = ["BTC", "ETH", "AVAX", "USDC"];
  const rows = symbols.map((symbol) => {
    const amount = Number(tokenCalculatorState[symbol].amount) || 0;
    const price = getTokenEffectivePrice(symbol);
    return {
      symbol,
      amount,
      price,
      value: amount * price,
    };
  });

  const grossAssets = rows.reduce((sum, row) => sum + row.value, 0);
  const debt = Number(tokenCalculatorState.debt) || 0;
  const netValue = grossAssets - debt;

  tokenCalculatorMetrics.innerHTML = [
    { label: "Gross assets", value: formatMoney(grossAssets, 2), hero: true },
    { label: "Net value", value: formatSignedMoney(netValue, 2), heroAccent: true },
    { label: "Total debt", value: formatMoney(debt, 2) },
    { label: "BTC value", value: formatMoney(rows.find((row) => row.symbol === "BTC").value, 2) },
    { label: "ETH value", value: formatMoney(rows.find((row) => row.symbol === "ETH").value, 2) },
    { label: "AVAX value", value: formatMoney(rows.find((row) => row.symbol === "AVAX").value, 2) },
    { label: "USDC value", value: formatMoney(rows.find((row) => row.symbol === "USDC").value, 2) },
    {
      label: "Price feed",
      value: marketPrices.updatedAt
        ? `${marketPrices.source} | ${formatDateTime(marketPrices.updatedAt)}`
        : marketPrices.source,
    },
  ]
    .map(
      (metric) => `
        <div class="metric-card ${metric.hero ? "hero" : ""} ${metric.heroAccent ? "hero-accent" : ""}">
          <span>${metric.label}</span>
          <strong>${metric.value}</strong>
        </div>
      `
    )
    .join("");
}

function bindTokenCalculatorControls() {
  Array.from(document.querySelectorAll("[data-token-amount]")).forEach((input) => {
    input.addEventListener("input", () => {
      tokenCalculatorState[input.dataset.tokenAmount].amount = Number(input.value) || 0;
      renderTokenCalculatorMetrics();
    });
  });

  Array.from(document.querySelectorAll("[data-token-mode]")).forEach((select) => {
    select.addEventListener("change", () => {
      tokenCalculatorState[select.dataset.tokenMode].mode = select.value;
      renderTokenCalculator();
    });
  });

  Array.from(document.querySelectorAll("[data-token-price]")).forEach((input) => {
    input.addEventListener("input", () => {
      tokenCalculatorState[input.dataset.tokenPrice].manualPrice = input.value;
      renderTokenCalculatorMetrics();
    });
  });

  document.getElementById("portfolioDebt")?.addEventListener("input", (event) => {
    tokenCalculatorState.debt = Number(event.target.value) || 0;
    renderTokenCalculatorMetrics();
  });
}

function renderTokenCalculator() {
  tokenCalculatorForm.innerHTML = `
    <div class="field-hint">Live prices refresh every 60 seconds from Binance when available. Manual mode lets you model custom targets.</div>
    <div class="token-grid-shell">
      ${buildTokenRows()}
    </div>
    <label class="field">
      <span class="input-label">Total debt (USD)</span>
      <input class="calculator-input" id="portfolioDebt" type="number" step="0.01" value="${tokenCalculatorState.debt}" />
    </label>
  `;

  renderTokenCalculatorMetrics();
  bindTokenCalculatorControls();
}

function openPoolModal(poolId) {
  modalPoolId = poolId;
  renderModal();
  poolModal.classList.remove("hidden");
}

function closePoolModal() {
  modalPoolId = null;
  poolModal.classList.add("hidden");
}

function renderModal() {
  if (!modalPoolId) {
    return;
  }

  const state = getAllPoolStates().find((item) => item.id === modalPoolId);
  if (!state) {
    closePoolModal();
    return;
  }

  modalPoolTitle.textContent = `${state.asset} | ${state.dex} | ${state.network}`;
  modalPoolSubtitle.textContent = `История только для просмотра. Редактирование снапшотов выполняется скопом для всех пулов.`;

  modalHistoryTable.innerHTML = `
    <thead>
      <tr>
        <th>Snapshot time</th>
        <th>Total fees</th>
        <th>Delta</th>
      </tr>
    </thead>
    <tbody>
      ${state.snapshots
        .slice()
        .reverse()
        .map((snapshot, index, reversed) => {
          const older = reversed[index + 1];
          const delta =
            older && older.totalFees > 0
              ? ((snapshot.totalFees - older.totalFees) / older.totalFees) * 100
              : 0;
          return `
            <tr>
              <td>${formatDateTime(snapshot.snapshotAt)}</td>
              <td>${formatMoney(snapshot.totalFees)}</td>
              <td>${older ? formatPercent(delta, 2) : "-"}</td>
            </tr>
          `;
        })
        .join("")}
    </tbody>
  `;
}


async function fetchFearGreedIndex() {
  try {
    const response = await fetch("/api/fear-greed");
    if (!response.ok) throw new Error("Fear & Greed request failed");
    const data = await response.json();
    const item = data?.data?.[0];
    if (!item) throw new Error("Fear & Greed payload missing");

    fearGreedState = {
      value: Number(item.value),
      classification: item.value_classification,
      updatedAt: new Date().toISOString(),
      source: "Alternative.me",
    };

    if (document.querySelector('[data-view-panel="strategy"].view-active')) {
      renderFearGreedBlock();
    }
  } catch {
    if (fearGreedState.value === null) {
      fearGreedState = { value: "—", classification: "нет данных", updatedAt: null, source: "Alternative.me" };
    }
  }
}

function renderAll() {
  renderSummary();
  renderSections();
  renderCalculator();
  renderFearGreedBlock();
  renderStrategyCalibrationPools();
  renderStrategyPortfolio();
  renderStrategyManual();
  if (modalPoolId) {
    renderModal();
  }
}

function bindNavigation() {
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      navButtons.forEach((item) =>
        item.classList.toggle("active", item.dataset.view === view)
      );
      viewPanels.forEach((panel) =>
        panel.classList.toggle("view-active", panel.dataset.viewPanel === view)
      );
    });
  });
}

bindNavigation();
modalBackdrop.addEventListener("click", closePoolModal);
modalClose.addEventListener("click", closePoolModal);
backupFileInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) {
    restoreBackupFromFile(file);
  }
});
seedMarketPricesFromPools();
fetchBinancePrices();
fetchFearGreedIndex();
setInterval(fetchBinancePrices, 60000);
setInterval(fetchFearGreedIndex, 300000);
resetBatchDraft();
renderAll();


function formatTokenAmount(value, digits = 6) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value);
}

function validateStrategyManualInputs(input) {
  const capital = Number(input.capital);
  const currentPrice = Number(input.currentPrice);
  const width = Number(input.width);
  const assetPct = Number(input.assetPct);
  const usdcPct = Number(input.usdcPct);

  if (!Number.isFinite(capital) || capital <= 0) return { valid: false, message: "Капитал должен быть больше 0." };
  if (!Number.isFinite(currentPrice) || currentPrice <= 0) return { valid: false, message: "Текущая цена должна быть больше 0." };
  if (!Number.isFinite(width) || width <= 0) return { valid: false, message: "Ширина диапазона должна быть больше 0." };
  if (!Number.isFinite(assetPct) || assetPct < 0) return { valid: false, message: "Доля актива % must be 0 or greater." };
  if (!Number.isFinite(usdcPct) || usdcPct < 0) return { valid: false, message: "Доля Доля USDC должна быть не меньше 0." };
  if (Math.abs(assetPct + usdcPct - 100) > 1e-9) return { valid: false, message: "Доля актива % and Доля USDC % must sum to 100." };

  const downside = width * (usdcPct / 100);
  const lowerBound = currentPrice - downside;
  if (!Number.isFinite(lowerBound) || lowerBound <= 0) return { valid: false, message: "Нижняя граница должна оставаться выше 0." };

  return { valid: true };
}

function calculateStrategyManualCore(input) {
  const validation = validateStrategyManualInputs(input);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const capital = Number(input.capital);
  const currentPrice = Number(input.currentPrice);
  const width = Number(input.width);
  const assetPct = Number(input.assetPct);
  const usdcPct = Number(input.usdcPct);

  const downside = width * (usdcPct / 100);
  const upside = width * (assetPct / 100);
  const lowerBound = currentPrice - downside;
  const upperBound = currentPrice + upside;
  const initialAssetUnits = (capital * (assetPct / 100)) / currentPrice;
  const boughtAssetUnitsAtLower = (capital * (usdcPct / 100)) / (Math.sqrt(lowerBound) * Math.sqrt(currentPrice));
  const totalAssetUnitsAtLower = initialAssetUnits + boughtAssetUnitsAtLower;
  const pnlAtLower = (totalAssetUnitsAtLower * lowerBound) - capital;

  return {
    lowerBound,
    upperBound,
    initialAssetUnits,
    boughtAssetUnitsAtLower,
    totalAssetUnitsAtLower,
    pnlAtLower,
  };
}

function renderStrategyManualMetrics(result) {
  const strategyManualMetrics = document.getElementById("strategyManualMetrics");
  strategyManualMetrics.innerHTML = [
    { label: "Нижняя граница", value: formatMoney(result.lowerBound, 2), hero: true },
    { label: "Верхняя граница", value: formatMoney(result.upperBound, 2), heroAccent: true },
    { label: "Стартовое количество актива", value: formatTokenAmount(result.initialAssetUnits, 8) },
    { label: "Купленный актив на нижней границе", value: formatTokenAmount(result.boughtAssetUnitsAtLower, 8) },
    { label: "Итого актива на нижней границе", value: formatTokenAmount(result.totalAssetUnitsAtLower, 8) },
    { label: "PnL на нижней границе", value: formatSignedMoney(result.pnlAtLower, 2) },
  ]
    .map(
      (metric) => `
    <div class="metric-card ${metric.hero ? "hero" : ""} ${metric.heroAccent ? "hero-accent" : ""}">
      <span>${metric.label}</span>
      <strong>${metric.value}</strong>
    </div>
  `
    )
    .join("");
}

function renderStrategyPortfolio() {
  const form = document.getElementById("strategyPortfolioForm");
  if (!form) return;

  rebalanceStrategyAllocations();
  const keys = strategySelectedKeys();

  form.innerHTML = `
    <label class="field">
      <span class="input-label">Общий капитал (USD)</span>
      <input class="calculator-input" type="number" step="any" min="0" name="capital" value="${strategyManualState.capital}" />
    </label>
    ${keys.map((key) => {
      const pool = getStrategyPoolForKey(key);
      const price = getStrategyPriceForKey(key);
      const alloc = strategyManualState.allocations[key] || 0;
      const usd = strategyManualState.capital * (alloc / 100);
      return `
        <div class="token-row" style="grid-template-columns: 120px repeat(3, minmax(0, 1fr));">
          <div class="token-symbol">${key === "ethereum" ? "ETH" : key === "bitcoin" ? "BTC" : "AVAX"}</div>
          <label class="field">
            <span class="input-label">Аллокация %</span>
            <input class="calculator-input" type="number" step="any" min="0" max="100" data-allocation-input="${key}" value="${alloc}" />
          </label>
          <label class="field">
            <span class="input-label">Цена</span>
            <input class="calculator-input" type="number" step="any" min="0" data-price-input="${key}" value="${price}" ${strategyManualState.calibration[key].manualPriceMode ? "" : "disabled"} />
          </label>
          <div class="token-inline-note">
            ${pool ? `${getPoolDisplayOption(pool)}` : "Pool not selected"}<br/>
            В USD: ${formatMoney(usd, 2)}<br/>
            <label style="display:inline-flex; gap:6px; align-items:center; margin-top:6px;">
              <input type="checkbox" data-manual-price-toggle="${key}" ${strategyManualState.calibration[key].manualPriceMode ? "checked" : ""} />
              <span>Manual price</span>
            </label>
          </div>
        </div>
      `;
    }).join("")}
  `;

  form.querySelector('[name="capital"]').addEventListener('input', (event) => {
    strategyManualState.capital = Number(event.target.value) || 0;
    renderAll();
  });

  form.querySelectorAll('[data-allocation-input]').forEach((el) => {
    el.addEventListener('input', (event) => {
      const key = event.target.dataset.allocationInput;
      strategyManualState.allocations[key] = Number(event.target.value) || 0;
      rebalanceStrategyAllocations(key);
      renderAll();
    });
  });

  form.querySelectorAll('[data-manual-price-toggle]').forEach((el) => {
    el.addEventListener('change', (event) => {
      const key = event.target.dataset.manualPriceToggle;
      strategyManualState.calibration[key].manualPriceMode = event.target.checked;
      if (!event.target.checked) strategyManualState.calibration[key].manualPrice = "";
      renderAll();
    });
  });

  form.querySelectorAll('[data-price-input]').forEach((el) => {
    el.addEventListener('input', (event) => {
      const key = event.target.dataset.priceInput;
      strategyManualState.calibration[key].manualPrice = event.target.value;
    });
  });
}

function renderStrategyManual() {
  const strategyManualForm = document.getElementById("strategyManualForm");
  if (!strategyManualForm) return;

  const keys = strategySelectedKeys();
  const assetUsd = strategyManualState.capital * (strategyManualState.assetPct / 100);
  const usdcUsd = strategyManualState.capital * (strategyManualState.usdcPct / 100);
  const selectedPool = getStrategySelectedPool();
  const currentPrice = selectedPool ? getCurrentMarketPriceForPool(selectedPool) : 0;

  strategyManualForm.innerHTML = `
    <div class="field-hint warning-note">Сейчас это только ручное ядро стратегии. Auto Split и логика плеча пока не включены.</div>
    <div class="field-row">
      <label class="field">
        <span class="input-label">Ширина диапазона</span>
        <input class="calculator-input" type="number" step="any" min="0" name="width" value="${strategyManualState.width}" />
      </label>
      <label class="field">
        <span class="input-label">Доля актива %</span>
        <input class="calculator-input" type="number" step="any" min="0" max="100" name="assetPct" value="${strategyManualState.assetPct}" />
      </label>
    </div>
    <label class="field">
      <span class="input-label">Доля USDC %</span>
      <input class="calculator-input" type="number" step="any" min="0" max="100" name="usdcPct" value="${strategyManualState.usdcPct}" />
    </label>
    ${keys.map((key) => {
      const pool = getStrategyPoolForKey(key);
      const allocPct = strategyManualState.allocations[key] || 0;
      const poolCapital = strategyManualState.capital * (allocPct / 100);
      const poolAssetUsd = poolCapital * (strategyManualState.assetPct / 100);
      const poolUsdcUsd = poolCapital * (strategyManualState.usdcPct / 100);
      return `
        <div class="token-row" style="grid-template-columns: 120px 1fr;">
          <div class="token-symbol">${key === "ethereum" ? "ETH" : key === "bitcoin" ? "BTC" : "AVAX"}</div>
          <div class="token-inline-note">
            ${pool ? getPoolDisplayOption(pool) : "Pool not selected"}<br/>
            Аллокация: ${formatNumber(allocPct, 2)}% / ${formatMoney(poolCapital, 2)}<br/>
            Актив: ${formatMoney(poolAssetUsd, 2)} | USDC: ${formatMoney(poolUsdcUsd, 2)}
          </div>
        </div>
      `;
    }).join("")}
    <div class="field-hint">Здесь показывается математика накопления на нижней границе, а не полная симуляция рыночного пути.</div>
    <div class="calculator-actions">
      <button class="calculator-button" type="submit">Рассчитать стратегию</button>
    </div>
  `;

  const validation = validateStrategyManualInputs({
    capital: strategyManualState.capital,
    currentPrice,
    width: strategyManualState.width,
    assetPct: strategyManualState.assetPct,
    usdcPct: strategyManualState.usdcPct,
  });
  if (validation.valid) {
    renderStrategyManualMetrics(calculateStrategyManualCore({
      capital: strategyManualState.capital,
      currentPrice,
      width: strategyManualState.width,
      assetPct: strategyManualState.assetPct,
      usdcPct: strategyManualState.usdcPct,
    }));
  }

  strategyManualForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(strategyManualForm);
    strategyManualState.width = Number(form.get("width"));
    strategyManualState.assetPct = Number(form.get("assetPct"));
    strategyManualState.usdcPct = Number(form.get("usdcPct"));

    const input = {
      capital: strategyManualState.capital,
      currentPrice,
      width: strategyManualState.width,
      assetPct: strategyManualState.assetPct,
      usdcPct: strategyManualState.usdcPct,
    };

    const validation = validateStrategyManualInputs(input);
    if (!validation.valid) {
      showToast(validation.message);
      return;
    }

    renderStrategyManualMetrics(calculateStrategyManualCore(input));
    renderStrategyManual();
  });
}


function getStrategyPoolsByEcosystem(ecosystem) {
  return getAllPoolStates().filter((state) => state.ecosystem === ecosystem);
}

function getStrategySelectedPool() {
  const keys = strategySelectedKeys();
  const firstKey = keys[0] || "ethereum";
  return getStrategyPoolForKey(firstKey) || getAllPoolStates()[0];
}

function getStrategyCurrentPrice(selectedPool) {
  return getCurrentMarketPriceForPool(selectedPool);
}

function renderFearGreedBlock() {
  const block = document.getElementById("fearGreedBlock");
  if (!block) return;

  const value = fearGreedState.value ?? "—";
  const classificationMap = {
    "Extreme Fear": "Крайний страх",
    "Fear": "Страх",
    "Neutral": "Нейтрально",
    "Greed": "Жадность",
    "Extreme Greed": "Крайняя жадность",
  };
  const classification = classificationMap[fearGreedState.classification] || fearGreedState.classification || "нет данных";

  block.innerHTML = `
    <div class="strategy-fg-inline">
      <span class="field-hint">Индекс страха и жадности:</span>
      <strong>${value} / ${classification}</strong>
      <span class="field-hint">Источник: ${fearGreedState.source}</span>
    </div>
  `;
}


function renderStrategyCalibrationPools() {
  const root = document.getElementById("strategyCalibrationPools");
  if (!root) return;

  const labels = { ethereum: "ETH", bitcoin: "BTC", avalanche: "AVAX" };
  root.innerHTML = ["ethereum", "bitcoin", "avalanche"].map((key) => {
    const cfg = strategyManualState.calibration[key];
    const pools = getAllPoolStates().filter((state) => state.ecosystem === key);
    const selected = pools.find((pool) => pool.id === cfg.poolId) || pools[0];
    if (selected) cfg.poolId = selected.id;
    return `
      <article class="strategy-calibration-card">
        <label class="field" style="grid-template-columns: auto 1fr; align-items: center; gap: 10px;">
          <input type="checkbox" data-calibration-enabled="${key}" ${cfg.enabled ? "checked" : ""} />
          <span class="input-label">${labels[key]} pool включён</span>
        </label>
        <label class="field">
          <span class="input-label">${labels[key]} reference pool</span>
          <select class="calculator-select" data-calibration-pool="${key}">
            ${pools.map((pool) => `<option value="${pool.id}" ${pool.id === cfg.poolId ? "selected" : ""}>${getPoolDisplayOption(pool)}</option>`).join("")}
          </select>
        </label>
        <p class="field-hint">Ref APR: ${selected ? formatNumber(selected.apr, 2) : "0.00"}%</p>
      </article>
    `;
  }).join("");

  root.querySelectorAll('[data-calibration-enabled]').forEach((el) => {
    el.addEventListener('change', (event) => {
      const key = event.target.dataset.calibrationEnabled;
      strategyManualState.calibration[key].enabled = event.target.checked;
      rebalanceStrategyAllocations();
      renderAll();
    });
  });

  root.querySelectorAll('[data-calibration-pool]').forEach((el) => {
    el.addEventListener('change', (event) => {
      const key = event.target.dataset.calibrationPool;
      strategyManualState.calibration[key].poolId = event.target.value;
      renderAll();
    });
  });
}

function strategySelectedKeys() {
  return ["ethereum", "bitcoin", "avalanche"].filter((key) => strategyManualState.calibration[key].enabled);
}

function getStrategyPoolForKey(key) {
  return getAllPoolStates().find((state) => state.id === strategyManualState.calibration[key].poolId) || null;
}

function getStrategyPriceForKey(key) {
  const cfg = strategyManualState.calibration[key];
  const pool = getStrategyPoolForKey(key);
  if (cfg.manualPriceMode && Number(cfg.manualPrice) > 0) return Number(cfg.manualPrice);
  return pool ? getCurrentMarketPriceForPool(pool) : 0;
}

function rebalanceStrategyAllocations(changedKey = null) {
  const keys = strategySelectedKeys();
  if (!keys.length) return;

  for (const key of ["ethereum", "bitcoin", "avalanche"]) {
    if (!keys.includes(key)) strategyManualState.allocations[key] = 0;
  }

  if (!changedKey || !keys.includes(changedKey)) {
    if (keys.length === 1) {
      strategyManualState.allocations[keys[0]] = 100;
      return;
    }
    if (keys.length === 2) {
      if (keys.includes("ethereum") && keys.includes("bitcoin")) {
        strategyManualState.allocations.ethereum = 30;
        strategyManualState.allocations.bitcoin = 70;
      } else if (keys.includes("ethereum") && keys.includes("avalanche")) {
        strategyManualState.allocations.ethereum = 99;
        strategyManualState.allocations.avalanche = 1;
      } else if (keys.includes("bitcoin") && keys.includes("avalanche")) {
        strategyManualState.allocations.bitcoin = 99;
        strategyManualState.allocations.avalanche = 1;
      }
      return;
    }
    if (keys.length === 3) {
      strategyManualState.allocations.ethereum = 30;
      strategyManualState.allocations.bitcoin = 69;
      strategyManualState.allocations.avalanche = 1;
      return;
    }
  }

  const changedValue = Math.max(0, Math.min(100, Number(strategyManualState.allocations[changedKey]) || 0));
  strategyManualState.allocations[changedKey] = changedValue;
  const others = keys.filter((k) => k !== changedKey);
  const remainder = Number((100 - changedValue).toFixed(2));

  if (others.length === 1) {
    strategyManualState.allocations[others[0]] = remainder;
    return;
  }

  if (others.length === 2) {
    const [first, second] = others;
    const currentFirst = Number(strategyManualState.allocations[first]) || 0;
    const currentSecond = Number(strategyManualState.allocations[second]) || 0;
    const total = currentFirst + currentSecond;
    if (total <= 0) {
      strategyManualState.allocations[first] = remainder;
      strategyManualState.allocations[second] = 0;
    } else {
      const firstValue = Number(((currentFirst / total) * remainder).toFixed(2));
      strategyManualState.allocations[first] = firstValue;
      strategyManualState.allocations[second] = Number((remainder - firstValue).toFixed(2));
    }
  }
}
