type FormatCurrencyOpts = {
  significantFigures?: number;
  excludeDollarSign?: boolean;
}

export function formatCurrency(
  amount: number | string,
  { significantFigures = 3, excludeDollarSign = true }: FormatCurrencyOpts = {}
): string {
  const units = ["", "k", "m", "bil", "tril"];
  let unitIndex = 0;
  let formattedAmount = parseFloat(String(amount));

  // Determine the unit index based on the amount
  while (formattedAmount >= 1000 && unitIndex < units.length - 1) {
    formattedAmount /= 1000;
    unitIndex++;
  }

  // Format the number with the specified significant figures
  const fixedAmount = formattedAmount.toPrecision(significantFigures);

  // Remove trailing zeros after decimal point and unnecessary decimal point
  const trimmedAmount = parseFloat(fixedAmount).toString();

  // Construct the final formatted currency string
  const currencySymbol = excludeDollarSign ? "" : "$";
  return `${currencySymbol}${trimmedAmount}${units[unitIndex]}`;
}
