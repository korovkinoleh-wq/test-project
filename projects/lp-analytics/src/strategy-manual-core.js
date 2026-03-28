function nearlyEqual(a, b, epsilon = 1e-9) {
  return Math.abs(a - b) <= epsilon;
}

function validateStrategyManualInputs(input) {
  const capital = Number(input.capital);
  const currentPrice = Number(input.currentPrice);
  const width = Number(input.width);
  const assetPct = Number(input.assetPct);
  const usdcPct = Number(input.usdcPct);

  if (!Number.isFinite(capital) || capital <= 0) {
    return { valid: false, message: "Capital must be greater than 0." };
  }

  if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
    return { valid: false, message: "Current price must be greater than 0." };
  }

  if (!Number.isFinite(width) || width <= 0) {
    return { valid: false, message: "Range width must be greater than 0." };
  }

  if (!Number.isFinite(assetPct) || assetPct < 0) {
    return { valid: false, message: "Asset % must be 0 or greater." };
  }

  if (!Number.isFinite(usdcPct) || usdcPct < 0) {
    return { valid: false, message: "USDC % must be 0 or greater." };
  }

  if (!nearlyEqual(assetPct + usdcPct, 100)) {
    return { valid: false, message: "Asset % and USDC % must sum to 100." };
  }

  const downside = width * (usdcPct / 100);
  const lowerBound = currentPrice - downside;

  if (!Number.isFinite(lowerBound) || lowerBound <= 0) {
    return { valid: false, message: "Lower bound must stay above 0." };
  }

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
    input: {
      capital,
      currentPrice,
      width,
      assetPct,
      usdcPct,
    },
    downside,
    upside,
    lowerBound,
    upperBound,
    initialAssetUnits,
    boughtAssetUnitsAtLower,
    totalAssetUnitsAtLower,
    pnlAtLower,
  };
}

module.exports = {
  validateStrategyManualInputs,
  calculateStrategyManualCore,
};
