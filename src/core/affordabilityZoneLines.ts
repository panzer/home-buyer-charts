import { Theme } from '@mui/material/styles';
import { Serie, Datum } from '@nivo/line';
import { Assumptions } from '../components/Assumptions';
import { sumExpenses } from '../components';
import { idealMonthlyPayment, range } from '../utils/math';
import { makeHorizontalLineData } from '../utils/nivo';

import { AffordibilityInputs } from './common';
import {
  dtiOfMonthlyPayment,
  getDownpaymentGivenPayment,
  getClosingCosts,
  maxMonthlyPaymentByDti,
} from './mortgage';

export type RiskLevels = {
  // minimum: number;
  low: number;
  medium: number;
  high: number;
  // maximum: number;
};

export type AffordabilityOptions = {
  dtiRisk: RiskLevels;
  cashReserveMonthsRisk: RiskLevels;
};

export function getRiskToColorMap(
  theme: Theme,
): Record<keyof RiskLevels, string> {
  return {
    // minimum: theme.palette.success.main,
    low: theme.palette.success.main,
    medium: theme.palette.warning.main,
    high: theme.palette.error.main,
    // maximum: theme.palette.error.main,
  };
}

export function getRiskToNameMap(): Record<keyof RiskLevels, string> {
  return {
    // minimum: 'Minimum',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    // maximum: 'Maximum',
  };
}

type RiskAssesment = { index: string } & RiskLevels;

export function getBarSerieForAffordabilityZone(
  inputs: AffordibilityInputs,
  assumptions: Assumptions,
  options: AffordabilityOptions,
  propertyValue: number,
): MonthlyPaymentAtRisks {
  const {
    maximumDti,
    itemizedOtherDebts,
    itemizedMonthlyUtilities,
    itemizedClosingCosts,
    loanInterestRate: loanApr,
    nMonthLoanTerm,
    propertyTaxRate,
  } = assumptions;
  const { cashOnHand, annualIncome } = inputs;
  const periodicRate = loanApr / 12;
  const monthlyIncome = annualIncome / 12.0;
  const totalOtherDebtsMonthly = sumExpenses(itemizedOtherDebts);
  const totalMonthlyUtilities = sumExpenses(itemizedMonthlyUtilities);
  const totalClosingCosts = sumExpenses(itemizedClosingCosts);
  // return [];
  // const propertyValues = [600_000, 700_000, 800_000, 900_000, 1_000_000];
  // return propertyValues.map(propertyValue => {
  return {
    reserve: {
      // index: String(propertyValue),
      ...Object.fromEntries(
        Object.entries(options.cashReserveMonthsRisk).map(
          ([riskLevel, cashReserveMonths]) => {
            const mp = idealMonthlyPayment({
              amountSaved: cashOnHand,
              propertyValue: propertyValue,
              nMonthBuffer: cashReserveMonths,
              monthlyFixed: totalMonthlyUtilities,
              propertyTaxRate: propertyTaxRate,
              interestRatePerPeriod: periodicRate,
              nLoanPeriods: nMonthLoanTerm,
              fixedClosingCosts: totalClosingCosts,
            });
            if (mp === null || isNaN(mp)) return [riskLevel, 0];
            return [riskLevel, mp];
          },
        ),
      ),
    } as RiskLevels,
    dti: {
      low: monthlyIncome * options.dtiRisk.low - totalOtherDebtsMonthly,
      medium: monthlyIncome * options.dtiRisk.medium - totalOtherDebtsMonthly,
      high: monthlyIncome * options.dtiRisk.high - totalOtherDebtsMonthly,
    },
  };
}

type PlotDataDisplayPurchaseRisk = {
  lowDtiLowReserve: number;
  lowDtiMediumReserve: number;
  lowDtiHighReserve: number;
  mediumDtiLowReserve: number;
  mediumDtiMediumReserve: number;
  mediumDtiHighReserve: number;
  highDtiLowReserve: number;
  highDtiMediumReserve: number;
  highDtiHighReserve: number;
};

type MonthlyPaymentAtRisks = {
  dti: RiskLevels;
  reserve: RiskLevels;
};

type Range = {
  low: number;
  high: number;
};
function overlapOfTwoRanges(first: Range, second: Range): Range {
  return {
    low: Math.max(first.low, second.low),
    high: Math.min(first.high, second.high),
  };
}
function sizeOfRange(range: Range): number {
  return range.high - range.low;
}

function sizeOfRangeOverlap(first: Range, second: Range): number {
  return Math.max(0, sizeOfRange(overlapOfTwoRanges(first, second)));
}

function calculateRiskCrossoversToDisplay(
  rawPayments: MonthlyPaymentAtRisks,
): PlotDataDisplayPurchaseRisk {
  /*
      Invariants:
      1. For dti, increased risk level requires increased payment amount
      2. For reserve, increased risk level requires lower payment amount
      Output:
      Calculates the overlap of each risk level, where low x low => lowDtiLowReserve and high x high => highDtiHighReserve
      The output is a set of 9 lines, each representing a risk level combination
      1. Each line stacks on top of the previous, so lowDtiMediumReserve is above lowDtiLowReserve
      */
  const { dti, reserve } = rawPayments;
  const lowDtiRange = { low: 0, high: dti.low };
  const mediumDtiRange = { low: dti.low, high: dti.medium };
  const highDtiRange = { low: dti.medium, high: dti.high };
  const lowReserveRange = { low: reserve.low, high: Infinity };
  const mediumReserveRange = { low: reserve.medium, high: reserve.low };
  const highReserveRange = { low: 0, high: reserve.medium };
  return {
    lowDtiLowReserve: sizeOfRangeOverlap(lowDtiRange, lowReserveRange),
    lowDtiMediumReserve: sizeOfRangeOverlap(lowDtiRange, mediumReserveRange),
    lowDtiHighReserve: sizeOfRangeOverlap(lowDtiRange, highReserveRange),
    mediumDtiLowReserve: sizeOfRangeOverlap(mediumDtiRange, lowReserveRange),
    mediumDtiMediumReserve: sizeOfRangeOverlap(
      mediumDtiRange,
      mediumReserveRange,
    ),
    mediumDtiHighReserve: sizeOfRangeOverlap(mediumDtiRange, highReserveRange),
    highDtiLowReserve: sizeOfRangeOverlap(highDtiRange, lowReserveRange),
    highDtiMediumReserve: sizeOfRangeOverlap(highDtiRange, mediumReserveRange),
    highDtiHighReserve: sizeOfRangeOverlap(highDtiRange, highReserveRange),
  };
}

export function getTestSeriesData(
  inputs: AffordibilityInputs,
  assumptions: Assumptions,
): ({ index: string } & PlotDataDisplayPurchaseRisk)[] {
  const minPurchasePrice = 400_000;
  const maxPurchasePrice = 1_200_000;
  const stepPurchasePrice = 40_000;

  const purchasePrices = range(
    minPurchasePrice,
    maxPurchasePrice,
    stepPurchasePrice,
  );
  const options: AffordabilityOptions = {
    dtiRisk: {
      low: 0.33,
      medium: 0.38,
      high: 0.43,
    },
    cashReserveMonthsRisk: {
      low: 12,
      medium: 6,
      high: 3,
    },
  };
  return purchasePrices.map((purchasePrice, index) => {
    try {
      const rawPayments = getBarSerieForAffordabilityZone(
        inputs,
        assumptions,
        options,
        purchasePrice,
      );
      const crossovers = calculateRiskCrossoversToDisplay(rawPayments);
      return {
        index: `${purchasePrice}`,
        ...crossovers,
      };
    } catch (e) {
      return {
        index: `${purchasePrice}`,
        lowDtiLowReserve: 0,
        lowDtiMediumReserve: 0,
        lowDtiHighReserve: 0,
        mediumDtiLowReserve: 0,
        mediumDtiMediumReserve: 0,
        mediumDtiHighReserve: 0,
        highDtiLowReserve: 0,
        highDtiMediumReserve: 0,
        highDtiHighReserve: 0,
      };
    }
  });
}

function scoreRisk(value: number, ranges: RiskLevels): keyof RiskLevels {
  if (value < ranges.low) {
    return 'low';
  } else if (value < ranges.medium) {
    return 'medium';
  } else {
    return 'high';
  }
}

function scoreRiskAscending(
  value: number,
  ranges: RiskLevels,
): keyof RiskLevels {
  if (value > ranges.low) {
    return 'low';
  } else if (value > ranges.medium) {
    return 'medium';
  } else {
    return 'high';
  }
}

function getCashReserveMonths(
  inputs: AffordibilityInputs,
  assumptions: Assumptions,
  monthlyPayment: number,
  purchasePrice: number,
): number {
  const downPayment = getDownpaymentGivenPayment({
    monthlyPayment,
    purchasePrice,
    assumptions,
  });
  const closingCosts = getClosingCosts(assumptions, purchasePrice);
  const cashReservedAfterClosing =
    inputs.cashOnHand - downPayment - closingCosts;
  const cashReserveMonths = cashReservedAfterClosing / monthlyPayment;
  return cashReserveMonths;
}

function riskLevelToNumber(riskLevel: keyof RiskLevels): number {
  switch (riskLevel) {
    case 'low':
      return 2;
    case 'medium':
      return 1;
    case 'high':
      return 0;
  }
}

export function getHeatmapAffordability(
  inputs: AffordibilityInputs,
  assumptions: Assumptions,
) {
  const minPurchasePrice = 400_000;
  const maxPurchasePrice = 1_200_000;
  const stepPurchasePrice = 40_000;

  const purchasePrices = range(
    minPurchasePrice,
    maxPurchasePrice,
    stepPurchasePrice,
  );
  const monthlyPayments = range(
    0,
    maxMonthlyPaymentByDti(inputs, assumptions),
    500,
  ).reverse();
  const options: AffordabilityOptions = {
    dtiRisk: {
      low: 0.33,
      medium: 0.38,
      high: 0.43,
    },
    cashReserveMonthsRisk: {
      low: 12,
      medium: 6,
      high: 3,
    },
  };
  return monthlyPayments.map(monthlyPayment => {
    return {
      id: monthlyPayment.toString(),
      data: purchasePrices.map(purchasePrice => {
        const dti = dtiOfMonthlyPayment(inputs, assumptions, monthlyPayment);
        const cashReserveMonths = getCashReserveMonths(
          inputs,
          assumptions,
          monthlyPayment,
          purchasePrice,
        );
        const dtiRiskLevel = scoreRisk(dti, options.dtiRisk);
        const cashReserveRiskLevel = scoreRiskAscending(
          cashReserveMonths,
          options.cashReserveMonthsRisk,
        );
        return {
          x: purchasePrice,
          y:
            riskLevelToNumber(dtiRiskLevel) *
            riskLevelToNumber(cashReserveRiskLevel),
        };
      }),
    };
  });
}

function getLineSerieForAffordabilityZone(
  inputs: AffordibilityInputs,
  assumptions: Assumptions,
  theme: Theme,
  options: AffordabilityOptions,
): Serie[] {
  const {
    maximumDti,
    itemizedOtherDebts,
    itemizedMonthlyUtilities,
    itemizedClosingCosts,
    loanInterestRate: loanApr,
    nMonthLoanTerm,
    propertyTaxRate,
  } = assumptions;
  const { cashOnHand, annualIncome } = inputs;
  const periodicRate = loanApr / 12;
  const monthlyIncome = annualIncome / 12.0;
  const totalOtherDebtsMonthly = sumExpenses(itemizedOtherDebts);
  const totalMonthlyUtilities = sumExpenses(itemizedMonthlyUtilities);
  const totalClosingCosts = sumExpenses(itemizedClosingCosts);
  const propertyValues = [600_000, 700_000, 800_000, 900_000, 1_000_000];

  const makePmtData = (pv: number[], nMonthBuffer: number): Datum[] => {
    return pv.map(v => ({
      x: v,
      y: idealMonthlyPayment({
        amountSaved: cashOnHand,
        propertyValue: v,
        nMonthBuffer: nMonthBuffer,
        monthlyFixed: totalMonthlyUtilities,
        propertyTaxRate: propertyTaxRate,
        interestRatePerPeriod: periodicRate,
        nLoanPeriods: nMonthLoanTerm,
        fixedClosingCosts: totalClosingCosts,
      }),
    }));
  };

  function maximumMonthlyPaymentAtDti(dti: number): number {
    return monthlyIncome * dti - totalOtherDebtsMonthly;
  }

  return [
    ...Object.entries(getRiskToColorMap(theme)).map(([risk, color]) => {
      const month = options.cashReserveMonthsRisk[risk as keyof RiskLevels];
      return {
        id: `Payment with ${month} month reserve`,
        data: makePmtData(propertyValues, month),
        color: color,
      };
    }),
    ...Object.entries(getRiskToColorMap(theme)).map(([risk, color]) => {
      const dti = options.dtiRisk[risk as keyof RiskLevels];
      return {
        id: `Payment with ${dti}% DTI`,
        data: makeHorizontalLineData(
          propertyValues,
          maximumMonthlyPaymentAtDti(dti),
        ),
        color: color,
      };
    }),
  ];
}
export default getLineSerieForAffordabilityZone;
