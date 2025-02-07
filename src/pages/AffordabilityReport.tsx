import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { OrdinalColorScaleConfig } from '@nivo/colors';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IncomeSelector from '../components/IncomeSelector';
import CashOnHandSelector from '../components/CashOnHandSelector';
import PercentagePie from '../components/PercentagePie';
import AssumptionsComponent, {
  Assumptions,
  defaultAssumptions,
} from '../components/Assumptions';
import { sumExpenses } from '../components';
import { formatCurrency, FORMAT_CURRENCY_BUDGET } from '../utils/currency';
import { minimumAcrossSeries, wrappedLegend } from '../utils/nivo';
import {
  idealMaximumDownPayment,
  idealMonthlyPayment,
  monthlyPaymentGivenDownPayment,
} from '../utils/math';
import NivoTooltip from '../components/NivoTooltip';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import BudgetTableRow from '../components/BudgetTable/BudgetTableRow';

const AffordabilityReport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [cashOnHand, setCashOnHand] = React.useState(250_000);
  const [annualIncome, setAnnualIncome] = React.useState(230_000);
  const [assumptions, setAssumptions] =
    React.useState<Assumptions>(defaultAssumptions);

  const {
    maximumDti,
    itemizedOtherDebts,
    itemizedMonthlyUtilities,
    itemizedClosingCosts,
    loanInterestRate: loanApr,
    nMonthLoanTerm,
    propertyTaxRate,
  } = assumptions as Assumptions;
  const totalOtherDebtsMonthly = sumExpenses(itemizedOtherDebts);
  const totalMonthlyUtilities = sumExpenses(itemizedMonthlyUtilities);
  const totalClosingCosts = sumExpenses(itemizedClosingCosts);

  const monthlyIncome = annualIncome / 12.0;
  const periodicRate = loanApr / 12.0;
  const limitMonthlyDti = monthlyIncome * maximumDti - totalOtherDebtsMonthly;
  const limitDownPayment = 0;

  const colorConfigCategorical: OrdinalColorScaleConfig = {
    scheme: 'category10',
  };

  // Mock data, replace with actual data sources
  const dataBar = [
    {
      id: 'Limited by Debt-to-Income',
      value: limitMonthlyDti,
    },
    {
      id: 'Limited by Down Payment',
      value: limitDownPayment,
    },
  ];

  const propertyValues = React.useMemo(
    () => [400_000, 600_000, 800_000, 1_000_000],
    [],
  );

  const makePmtData = React.useMemo(
    () => (pv: number[], nMonthBuffer: number) => {
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
    },
    [
      cashOnHand,
      totalMonthlyUtilities,
      totalClosingCosts,
      propertyTaxRate,
      periodicRate,
      nMonthLoanTerm,
    ],
  );

  function makeHorizontalLineData(pv: number[], y: number) {
    return pv.map(v => ({ x: v, y }));
  }

  const dataLine = React.useMemo(
    () => [
      {
        id: 'DTI: 30%',
        color: theme.palette.success.main,
        data: makeHorizontalLineData(
          propertyValues,
          monthlyIncome * 0.3 - totalOtherDebtsMonthly,
        ),
      },
      {
        id: 'DTI: 38%',
        color: theme.palette.warning.main,
        data: makeHorizontalLineData(
          propertyValues,
          monthlyIncome * 0.38 - totalOtherDebtsMonthly,
        ),
      },
      {
        id: 'DTI: 43%',
        color: theme.palette.error.main,
        data: makeHorizontalLineData(propertyValues, limitMonthlyDti),
      },
      {
        id: 'Payment with 3 month reserve',
        data: makePmtData(propertyValues, 3),
      },
      {
        id: 'Payment with 6 month reserve',
        data: makePmtData(propertyValues, 6),
      },
      {
        id: 'Payment with 12 month reserve',
        data: makePmtData(propertyValues, 12),
      },
      {
        id: 'Payment with 24 month reserve',
        data: makePmtData(propertyValues, 24),
      },
    ],
    [
      limitMonthlyDti,
      makePmtData,
      monthlyIncome,
      propertyValues,
      theme,
      totalOtherDebtsMonthly,
    ],
  );

  const dataPie = [
    {
      id: 'Other Debt Payments',
      value: totalOtherDebtsMonthly,
    },
    {
      id: 'Utility Payments',
      value: totalMonthlyUtilities,
    },
    {
      id: 'Mortage Principle + Interest',
      value: limitMonthlyDti,
    },
    {
      id: 'Escrow Payments',
      value: 500,
    },
  ].sort(({ value: va }, { value: vb }) => vb - va);

  const leg = wrappedLegend(dataPie, {
    legendProps: {
      anchor: isMobile ? 'bottom' : 'right',
      direction: isMobile ? 'row' : 'column',
      itemsSpacing: 10,
      itemWidth: 160,
      itemHeight: 18,
      itemTextColor: theme.palette.text.secondary,
      symbolSize: 18,
      symbolShape: 'circle',
    },
    translateX: isMobile ? 0 : 56,
    itemsPerLine: isMobile ? 2 : 'no-wrap',
    translateY: isMobile ? 100 : 0,
    colors: colorConfigCategorical,
  });
  console.log(cashOnHand);

  const budgetRemainForDebtExpenses = monthlyIncome * 0.43;
  const budgetRemainForHousing =
    budgetRemainForDebtExpenses - totalOtherDebtsMonthly;
  const budgetLimitMonthlyPiti = budgetRemainForHousing - totalMonthlyUtilities;

  return (
    <Stack spacing={2} alignItems={'center'} mx={2}>
      <Typography variant="h4" gutterBottom>
        Home Affordability Report
      </Typography>
      <Box>
        <IncomeSelector defaultValue={annualIncome} />
        <CashOnHandSelector
          defaultValue={cashOnHand}
          onSelect={x => setCashOnHand(x)}
        />
      </Box>

      <AssumptionsComponent onChange={setAssumptions} />
      <Typography
        variant="h5"
        textAlign="left"
        width="100%"
        sx={{ mx: 4, p: 1 }}
      >
        1. Monthly Budget Breakdown
      </Typography>
      <TableContainer component={Paper} sx={{ maxWidth: 'sm' }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow
              sx={{ backgroundColor: theme => theme.palette.action.hover }}
            >
              <TableCell size="small">Category</TableCell>
              <TableCell size="small" align="right">
                Monthly
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <BudgetTableRow
              name="Income"
              value={formatCurrency(monthlyIncome, FORMAT_CURRENCY_BUDGET)}
              percentage={1}
            />
            <BudgetTableRow
              name="Non-Debt Expenses (57%)"
              value={formatCurrency(
                monthlyIncome * -0.57,
                FORMAT_CURRENCY_BUDGET,
              )}
              percentage={0.57}
              percentageProps={{
                color: 'error',
                backgroundColor: 'info',
                offsetPercentage: 0.43,
              }}
            />
            <BudgetTableRow
              name="Remaining for Debt Expenses (43%)"
              value={formatCurrency(
                budgetRemainForDebtExpenses,
                FORMAT_CURRENCY_BUDGET,
              )}
              percentage={0.43}
            />
            <BudgetTableRow
              name="Sum of Existing Debts"
              value={formatCurrency(
                -totalOtherDebtsMonthly,
                FORMAT_CURRENCY_BUDGET,
              )}
            />
            <BudgetTableRow
              name="Remaining for Housing Costs"
              value={formatCurrency(
                budgetRemainForHousing,
                FORMAT_CURRENCY_BUDGET,
              )}
              percentage={budgetRemainForHousing / monthlyIncome}
            />
            <BudgetTableRow
              name="Fixed Monthly Housing Costs"
              value={formatCurrency(
                -totalMonthlyUtilities,
                FORMAT_CURRENCY_BUDGET,
              )}
            />
            <BudgetTableRow
              name="Remaining for Taxes, Insurance, and Mortgage Payments"
              value={formatCurrency(
                budgetLimitMonthlyPiti,
                FORMAT_CURRENCY_BUDGET,
              )}
              percentage={budgetLimitMonthlyPiti / monthlyIncome}
            />
          </TableBody>
        </Table>
      </TableContainer>
      <Typography
        variant="h5"
        textAlign="left"
        width="100%"
        sx={{ mx: 4, p: 1 }}
      >
        1. Your Affordability Zone
      </Typography>
      <Box height={400} width={'100%'}>
        <ErrorBoundary
          fallback={<Typography variant="h6">Something went wrong.</Typography>}
        >
          <ResponsiveLine
            data={dataLine}
            enableArea
            areaBaselineValue={minimumAcrossSeries(dataLine)}
            theme={{ text: { fill: theme.palette.text.primary } }}
            margin={{
              top: 50,
              right: isMobile ? 20 : 180,
              bottom: isMobile ? 150 : 50,
              left: 100,
            }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              // stacked: true,
              reverse: false,
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Home Purchase Value',
              legendOffset: 36,
              legendPosition: 'middle',
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Monthly Housing Payment',
              legendOffset: -60,
              legendPosition: 'middle',
            }}
            // colors={{ scheme: 'nivo' }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="y"
            pointLabelYOffset={-12}
            useMesh={true}
            yFormat={lp => formatCurrency(lp.valueOf())}
            tooltip={NivoTooltip}
            legends={[
              {
                anchor: isMobile ? 'bottom-left' : 'bottom-right',
                translateY: isMobile ? 150 : 0,
                direction: 'column',
                justify: false,
                translateX: 100,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </ErrorBoundary>
      </Box>
      {/* Example Bar Chart */}
      <Box height={400} width={'100%'}>
        <ResponsiveBar
          data={dataBar}
          keys={['value']}
          indexBy="id"
          margin={{ top: 50, right: isMobile ? 0 : 130, bottom: 50, left: 100 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'category',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'value',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          animate={true}
          // motionStiffness={90}
          // motionDamping={15}
        />
      </Box>
      {/* Example Line Chart */}

      {/* Example Pie Chart */}
      <Box height={400} width={'100%'}>
        <ResponsivePie
          data={dataPie}
          valueFormat={formatCurrency}
          margin={{
            top: 40,
            right: isMobile ? 20 : 156,
            bottom: isMobile ? 140 : 80,
            left: isMobile ? 20 : 0,
          }}
          innerRadius={0.5}
          padAngle={1}
          cornerRadius={3}
          colors={colorConfigCategorical}
          borderWidth={3}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLabelsSkipAngle={10}
          // arcLabelsTextColor={theme.palette.text.primary}

          // radialLabelsTextColor="#333333"
          // radialLabelsLinkColor={{ from: 'color' }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLinkLabelsTextColor={theme.palette.text.primary}
          // sliceLabelsTextColor="#333333"
          sortByValue={true}
          animate={true}
          isInteractive={true}
          legends={leg}
        />
      </Box>
    </Stack>
  );
};

export default AffordabilityReport;
