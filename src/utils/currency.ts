type FormatCurrencyOpts = {
  significantFigures?: number;
  withDollarSign?: boolean;
  withSuffix?: boolean;
  withCommas?: boolean;
  withSign?: boolean;
};

export const FORMAT_CURRENCY_DEFAULTS: FormatCurrencyOpts = {
  significantFigures: 3,
  withDollarSign: false,
  withSuffix: true,
  withCommas: true,
  withSign: false,
};

export const FORMAT_CURRENCY_PLOT_AXIS: FormatCurrencyOpts = {
  significantFigures: 3,
  withDollarSign: false,
  withSuffix: true,
  withCommas: false,
  withSign: false,
};

export const FORMAT_CURRENCY_PLOT_TICK: FormatCurrencyOpts = {
  significantFigures: 3,
  withDollarSign: false,
  withSuffix: true,
  withCommas: false,
  withSign: false,
};

export const FORMAT_CURRENCY_BUDGET: FormatCurrencyOpts = {
  significantFigures: 3,
  withDollarSign: true,
  withSuffix: false,
  withCommas: true,
  withSign: false,
};

export function formatCurrency(
  amount: number | string,
  opts: FormatCurrencyOpts = {},
): string {
  const {
    significantFigures,
    withDollarSign,
    withSuffix,
    withCommas,
    withSign,
  } = { ...FORMAT_CURRENCY_DEFAULTS, ...opts };

  const units = ['', 'k', 'm', 'bil', 'tril'];
  let unitIndex = 0;
  let formattedAmount = parseFloat(String(amount));

  // Determine the unit index based on the amount
  while (
    withSuffix &&
    formattedAmount >= 1000 &&
    unitIndex < units.length - 1
  ) {
    formattedAmount /= 1000;
    unitIndex++;
  }

  // Format the number with the specified significant figures
  const fixedAmount = Math.abs(formattedAmount).toPrecision(significantFigures);

  // Remove trailing zeros after decimal point and unnecessary decimal point
  const trimmedAmount = parseFloat(fixedAmount).toString();

  // Insert commas as thousand separators
  let formattedNumber = trimmedAmount;
  if (withCommas) {
    const parts = trimmedAmount.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formattedNumber = parts.join('.');
  }

  // Construct the final formatted currency string
  const currencySymbol = withDollarSign ? '$' : '';
  const sign = formattedAmount > 0 ? (withSign ? '+' : '') : '-';
  return `${sign}${currencySymbol}${formattedNumber}${units[unitIndex]}`;
}
