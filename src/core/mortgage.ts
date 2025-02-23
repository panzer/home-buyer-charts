import { Assumptions } from '../components/Assumptions';
import { sumExpenses } from '../components';
import { AffordibilityInputs } from './common';

export function dtiOfMonthlyPayment(
  inputs: AffordibilityInputs,
  assumptions: Assumptions,
  monthlyPayment: number,
): number {
  const { annualIncome } = inputs;
  const { itemizedOtherDebts } = assumptions;
  const monthlyIncome = annualIncome / 12;
  const monthlyDebt = sumExpenses(itemizedOtherDebts);
  return (monthlyPayment + monthlyDebt) / monthlyIncome;
}

export type AmortizedPaymentMultiplierInputs = {
  interestRatePerPeriod: number;
  nLoanPeriods: number;
};

export function getAmortizedPaymentMultiplier(
  inp: AmortizedPaymentMultiplierInputs,
): number {
  const { interestRatePerPeriod: i, nLoanPeriods: n } = inp;
  return (((1 + i) ^ n) - 1) / (i * ((i + 1) ^ n));
}

export function getTaxesInsuranceAndOtherMonthlyPayment(
  assumptions: Assumptions,
  propertyValue: number,
) {
  // Todo: account for PMI, homeowners insurance, and other escrow type payments
  const { itemizedOtherDebts, propertyTaxRate } = assumptions;
  return (
    sumExpenses(itemizedOtherDebts) + propertyValue * (propertyTaxRate / 12)
  );
}

export type DownPaymentCalcInputs = {
  monthlyPayment: number;
  purchasePrice: number;
  assumptions: Assumptions;
};

export function getDownpaymentGivenPayment(inp: DownPaymentCalcInputs): number {
  const { monthlyPayment: m, purchasePrice: v, assumptions } = inp;
  const { loanInterestRate, nMonthLoanTerm } = assumptions;
  const z = getAmortizedPaymentMultiplier({
    interestRatePerPeriod: loanInterestRate / 12,
    nLoanPeriods: nMonthLoanTerm,
  });
  const u = getTaxesInsuranceAndOtherMonthlyPayment(assumptions, v);
  const loanAmount = m * z - u;
  return v - loanAmount;
}

export function getClosingCosts(
  assumptions: Assumptions,
  purchasePrice: number,
): number {
  const { itemizedClosingCosts, closingCostPercOfPurchase } = assumptions;
  return (
    sumExpenses(itemizedClosingCosts) +
    closingCostPercOfPurchase * purchasePrice
  );
}

export function maxMonthlyPaymentByDti(
  inputs: AffordibilityInputs,
  assumptions: Assumptions,
): number {
  const { annualIncome } = inputs;
  const { maximumDti, itemizedOtherDebts } = assumptions;
  const monthlyIncome = annualIncome / 12;
  const monthlyDebt = sumExpenses(itemizedOtherDebts);
  return monthlyIncome * maximumDti - monthlyDebt;
}
