const { validateStrategyManualInputs, calculateStrategyManualCore } = require('./strategy-manual-core');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function runTests() {
  const case1 = calculateStrategyManualCore({
    capital: 1000,
    currentPrice: 2000,
    width: 400,
    assetPct: 50,
    usdcPct: 50,
  });
  assert(case1.lowerBound === 1800, 'Case 1 lowerBound should be 1800');
  assert(case1.upperBound === 2200, 'Case 1 upperBound should be 2200');
  assert(Number.isFinite(case1.totalAssetUnitsAtLower), 'Case 1 totalAssetUnitsAtLower should be finite');

  const case2 = calculateStrategyManualCore({
    capital: 1000,
    currentPrice: 2000,
    width: 400,
    assetPct: 5,
    usdcPct: 95,
  });
  assert(case2.lowerBound === 1620, 'Case 2 lowerBound should be 1620');
  assert(case2.upperBound === 2020, 'Case 2 upperBound should be 2020');
  assert(case2.boughtAssetUnitsAtLower > case2.initialAssetUnits, 'Accumulation split should buy more asset than initially held');

  const invalidSplit = validateStrategyManualInputs({
    capital: 1000,
    currentPrice: 2000,
    width: 400,
    assetPct: 40,
    usdcPct: 40,
  });
  assert(!invalidSplit.valid, 'Invalid split should fail validation');

  const invalidWidth = validateStrategyManualInputs({
    capital: 1000,
    currentPrice: 2000,
    width: 0,
    assetPct: 5,
    usdcPct: 95,
  });
  assert(!invalidWidth.valid, 'Zero width should fail validation');

  const invalidLowerBound = validateStrategyManualInputs({
    capital: 1000,
    currentPrice: 100,
    width: 200,
    assetPct: 5,
    usdcPct: 95,
  });
  assert(!invalidLowerBound.valid, 'Non-positive lower bound should fail validation');

  console.log('strategy-manual-core tests passed');
}

runTests();
