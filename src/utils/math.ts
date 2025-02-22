type ScaleOpts = {
  vMin?: number;
  ontoMin?: number;
} & ({ vMax?: number; ontoMax: number } | { vMax: number; ontoMax?: number });
export function scale(value: number, opts: ScaleOpts): number {
  const { vMin = 0, vMax = 1, ontoMin = 0, ontoMax = 1 } = opts;
  return ontoMin + (value / (vMax - vMin)) * ontoMax;
}

export function addNumberTo2DArray(array2D: number[][], numberToAdd: number) {
  return array2D.map(row => row.map(value => value + numberToAdd));
}

export function addNumberTo2DArrayWithPredicate(
  array2D: number[][],
  numberToAdd: number,
  predicateFn: (r: number, c: number) => boolean,
) {
  return array2D.map((row, rowIndex) =>
    row.map((value, colIndex) =>
      predicateFn(rowIndex, colIndex) ? value + numberToAdd : value,
    ),
  );
}

export function multiplyNumberTo2DArray(
  array2D: number[][],
  numberToMultiply: number,
) {
  return array2D.map(row => row.map(value => value * numberToMultiply));
}

export function divideNumberTo2DArray(
  array2D: number[][],
  numberToDivide: number,
) {
  return array2D.map(row => row.map(value => value / numberToDivide));
}

export function add2DArrays(array2D1: number[][], array2D2: number[][]) {
  return array2D1.map((row, rowIndex) =>
    row.map((value, colIndex) => value + array2D2[rowIndex][colIndex]),
  );
}

export function subtract2DArrays(array2D1: number[][], array2D2: number[][]) {
  return array2D1.map((row, rowIndex) =>
    row.map((value, colIndex) => value - array2D2[rowIndex][colIndex]),
  );
}

export function subtractNumberFrom2DArray(
  array2D: number[][],
  numberToSubtract: number,
) {
  return array2D.map(row => row.map(value => value - numberToSubtract));
}

export function subtract2DArrayFromNumber(
  numberToStart: number,
  array2D: number[][],
) {
  return array2D.map(row => row.map(value => numberToStart - value));
}

export function multiply2DArrays(array2D1: number[][], array2D2: number[][]) {
  return array2D1.map((row, rowIndex) =>
    row.map((value, colIndex) => value * array2D2[rowIndex][colIndex]),
  );
}

export function divide2DArrays(array2D1: number[][], array2D2: number[][]) {
  return array2D1.map((row, rowIndex) =>
    row.map((value, colIndex) => value / array2D2[rowIndex][colIndex]),
  );
}

export function transformUnary2DArray(
  array: number[][],
  transformFn: (v: number, r: number, c: number) => number,
) {
  return array.map((row, rowIndex) =>
    row.map((value, colIndex) => transformFn(value, rowIndex, colIndex)),
  );
}

export function duplicateColumnAcross2DArray(
  columnArray: number[],
  nRows: number,
): number[][] {
  return Array(nRows).fill([...columnArray]);
}

export function duplicateRowAcross2DArray(
  rowArray: number[],
  nCols: number,
): number[][] {
  return Array(rowArray.length)
    .fill(null)
    .map((_, index) => new Array(nCols).fill(rowArray[index]));
}

export function PMT(rate: number, nper: number, pv: number) {
  if (rate === 0) {
    return pv / nper;
  }

  const pvif = Math.pow(1 + rate, nper);
  return (rate / (pvif - 1)) * -(pv * pvif);
}

type AmortizedPaymentMultiplierInputs = {
  interestRatePerPeriod: number;
  nLoanPeriods: number;
};

function getAmortizedPaymentMultiplier(
  inp: AmortizedPaymentMultiplierInputs,
): number {
  const { interestRatePerPeriod: i, nLoanPeriods: n } = inp;
  return (((1 + i) ^ n) - 1) / (i * ((i + 1) ^ n));
}

type DownPaymentCalcInputs = {
  amountSaved: number; // S
  propertyValue: number; // V
  nMonthBuffer: number; // N
  monthlyFixed: number; // U
  propertyTaxRate: number; // R
  interestRatePerPeriod: number; // Z
  nLoanPeriods: number; // Z
  fixedClosingCosts: number; // C
};

export function idealMaximumDownPayment(
  inp: DownPaymentCalcInputs,
): number | null {
  const {
    propertyValue: v,
    nMonthBuffer: n,
    monthlyFixed: u,
    propertyTaxRate: r,
    amountSaved: s,
    fixedClosingCosts: c,
    interestRatePerPeriod,
    nLoanPeriods,
  } = inp;
  const rm = r / 12;
  const z = getAmortizedPaymentMultiplier({
    interestRatePerPeriod,
    nLoanPeriods,
  });
  // console.table(inp);
  if (s < c) return null; // cant cover closing costs
  if (s < n * (u + v * r)) return null; // cant cover safety net

  return (n * (rm * v * z + u * z + v) - (s - c) * z) / (n - z);
}

export function idealMonthlyPayment(inp: DownPaymentCalcInputs): number | null {
  const w = idealMaximumDownPayment(inp);
  return monthlyPaymentGivenDownPayment(w, inp);
}

export function monthlyPaymentGivenDownPayment(
  downPayment: number | null,
  inp: DownPaymentCalcInputs,
): number | null {
  const w = downPayment;
  if (w === null) return null;
  if (w < 0) return null;
  // todo: pull minimum down payment from assumptions
  if (w < inp.propertyValue * 0.03) return null;

  const loanAmount = inp.propertyValue - w;
  const pi =
    loanAmount /
    getAmortizedPaymentMultiplier({
      interestRatePerPeriod: inp.interestRatePerPeriod,
      nLoanPeriods: inp.nLoanPeriods,
    });
  const taxes = (inp.propertyTaxRate * inp.propertyValue) / 12.0;
  const insuranceAndOther = inp.monthlyFixed; // todo: add insurance
  return pi + taxes + insuranceAndOther;
}

export function lesserOf(first: number, second: number | null) {
  return second !== null && second < first ? second : first;
}
