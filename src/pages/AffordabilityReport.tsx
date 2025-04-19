import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import {
  Theme as NivoTheme,
  patternLinesDef,
  patternDotsDef,
} from '@nivo/core';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { ResponsiveSankey } from '@nivo/sankey';
import { OrdinalColorScaleConfig } from '@nivo/colors';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Bookmark from '@mui/icons-material/Bookmark';
import BookmarkBorder from '@mui/icons-material/BookmarkBorder';
import IncomeSelector from '../components/IncomeSelector';
import CashOnHandSelector from '../components/CashOnHandSelector';
import AssumptionsComponent, {
  Assumptions,
  defaultAssumptions,
} from '../components/Assumptions';
import { sumExpenses } from '../components';
import { formatCurrency, FORMAT_CURRENCY_BUDGET } from '../utils/currency';
import {
  minimumAcrossSeries,
  wrappedLegend,
  makeHorizontalLineData,
} from '../utils/nivo';

import NivoTooltip from '../components/NivoTooltip';
import {
  Button,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import BudgetTableRow from '../components/BudgetTable/BudgetTableRow';
import {
  getHeatmapAffordability,
  getTestSeriesData,
} from '../core/affordabilityZoneLines';

const AffordabilityReport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Calculation state
  const [cashOnHand, setCashOnHand] = React.useState(250_000);
  const [annualIncome, setAnnualIncome] = React.useState(230_000);
  const [assumptions, setAssumptions] =
    React.useState<Assumptions>(defaultAssumptions);

  // UI state
  const [isPinned, setIsPinned] = React.useState(false);

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

  const colorConfigCategorical: OrdinalColorScaleConfig = {
    scheme: 'category10',
  };

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

  const barColors = [
    theme.palette.success.main,
    theme.palette.success.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.warning.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.error.main,
    theme.palette.error.main,
  ];
  // const barLegend = wrappedLegend(dataPie, {
  //   legendProps: {
  //     // itemsSpacing: 10,
  //     // itemWidth: 160,
  //     // itemHeight: 18,
  //     // symbolSize: 18,
  //     // symbolShape: 'circle',
  //     dataFrom: 'keys',
  //     anchor: isMobile ? 'bottom' : 'right',
  //     direction: isMobile ? 'row' : 'column',
  //     justify: false,
  //     translateX: 120,
  //     translateY: 0,
  //     itemsSpacing: 2,
  //     itemWidth: 100,
  //     itemHeight: 20,
  //     itemTextColor: theme.palette.text.secondary,
  //     itemDirection: 'left-to-right',
  //     itemOpacity: 0.85,
  //     symbolSize: 20,
  //     effects: [
  //       {
  //         on: 'hover',
  //         style: {
  //           itemOpacity: 1,
  //         },
  //       },
  //     ],
  //   },
  //   translateX: isMobile ? 0 : 56,
  //   itemsPerLine: isMobile ? 2 : 'no-wrap',
  //   translateY: isMobile ? 100 : 0,
  //   colors: colorConfigCategorical,
  // });

  const budgetRemainForDebtExpenses = monthlyIncome * 0.43;
  const budgetRemainForHousing =
    budgetRemainForDebtExpenses - totalOtherDebtsMonthly;
  const budgetLimitMonthlyPiti = budgetRemainForHousing - totalMonthlyUtilities;

  const chartTheme: NivoTheme = {
    text: {
      fill: theme.palette.text.primary,
    },
    annotations: {
      text: {
        fill: theme.palette.text.primary,
        outlineWidth: 2,
        outlineColor: theme.palette.background.default,
      },
      link: {
        stroke: theme.palette.text.primary,
        outlineWidth: 2,
        outlineColor: theme.palette.background.default,
      },
      outline: {
        stroke: theme.palette.text.primary,
        outlineWidth: 2,
        outlineColor: theme.palette.background.default,
      },
      symbol: {
        fill: theme.palette.text.primary,
        outlineWidth: 2,
        outlineColor: theme.palette.background.default,
      },
    },
  };
  const pattern = (id: string, color: string) =>
    patternDotsDef(id, {
      color,
      size: 2.5,
      padding: 0.1,
      stagger: true,
      background: 'inherit',
    });
  // patternLinesDef('green-lines', { color: theme.palette.success.main, rotation: -45, lineWidth: 5, spacing: 10, background: 'inherit' }),

  return (
    <Stack spacing={2} alignItems={'center'} mx={2}>
      <Typography variant="h4" gutterBottom>
        Home Affordability Report
      </Typography>
      <Paper
        variant={isPinned ? 'elevation' : 'outlined'}
        elevation={isPinned ? 4 : 0}
        sx={{
          p: 2,
          position: isPinned ? 'sticky' : 'static',
          top: theme => theme.spacing(2),
          zIndex: 1000,
          maxWidth: 'sm',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <IncomeSelector
          defaultValue={annualIncome}
          onSelect={x => setAnnualIncome(x)}
        />
        <CashOnHandSelector
          defaultValue={cashOnHand}
          onSelect={x => setCashOnHand(x)}
        />
        <IconButton color="primary" onClick={() => setIsPinned(!isPinned)}>
          {isPinned ? <Bookmark /> : <BookmarkBorder />}
        </IconButton>
      </Paper>
      <Box>
        <Accordion sx={{ width: '100%', maxWidth: 'md' }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h5">Assumptions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AssumptionsComponent onChange={setAssumptions} />
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ width: '100%', maxWidth: 'md' }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h5">1. Monthly Budget Breakdown</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} sx={{ maxWidth: 'sm' }}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: theme => theme.palette.action.hover,
                    }}
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
                    value={formatCurrency(
                      monthlyIncome,
                      FORMAT_CURRENCY_BUDGET,
                    )}
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
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ width: '100%', maxWidth: 'md' }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h5" textAlign="left" width="100%">
              2. Your Affordability Zone
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" textAlign="left" width="100%">
              Your affordability zone is made up from two factors:
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" textAlign="left" width="100%">
                  2.1. Debt-to-Income (DTI) Ratio
                </Typography>
                <Typography variant="body1" textAlign="left" width="100%">
                  Your DTI ratio is the percentage of your monthly income that
                  goes towards housing costs. A lower monthly payment is more
                  comfortable to afford. Everyone understands that paying less,
                  when possible, is better.
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" textAlign="left" width="100%">
                  2.2. Savings Retained After the Purchase
                </Typography>
                <Typography variant="body1" textAlign="left" width="100%">
                  Given the amount of money you have saved, a certain amount of
                  savings must be retained after the purchase to ensure you have
                  enough money for emergencies and other expenses. In some
                  cases, a lender may require at least 3 months worth of
                  expenses. However, for a comfortable safety net, you can aim
                  for 6 months, a year, or more. This puts a lower limit on how
                  low your monthly payment could get.
                </Typography>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box height={400} width={'100%'}>
        <ResponsiveSankey
          data={{
            nodes: [
              // { id: 'Income' },
              // { id: 'Other Obligated Expenses' },
              { id: 'Total Allowed Debt (43%)' },
              { id: 'Non-Housing Debt' },
              { id: 'Total Housing Cost' },
              { id: 'Mortgage Payment' },
              { id: 'Property Taxes' },
              { id: 'Homeowners Insurance' },
              { id: 'HOA Fees' },
              { id: 'Maintenance' },
              { id: 'Utilities' },
            ],
            links: [
              // {
              //   source: 'Income',
              //   target: 'Other Obligated Expenses',
              //   value: 57,
              // },
              // {
              //   source: 'Income',
              //   target: 'Total Allowed Debt (43%)',
              //   value: 43,
              // },
              {
                source: 'Total Allowed Debt (43%)',
                target: 'Total Housing Cost',
                value: 30,
              },
              {
                source: 'Total Allowed Debt (43%)',
                target: 'Non-Housing Debt',
                value: 13,
              },
              {
                source: 'Total Housing Cost',
                target: 'Mortgage Payment',
                value: 25,
              },
              {
                source: 'Total Housing Cost',
                target: 'Property Taxes',
                value: 1,
              },
              {
                source: 'Total Housing Cost',
                target: 'Homeowners Insurance',
                value: 1,
              },
              { source: 'Total Housing Cost', target: 'HOA Fees', value: 1 },
              { source: 'Total Housing Cost', target: 'Maintenance', value: 1 },
              { source: 'Total Housing Cost', target: 'Utilities', value: 1 },
            ],
          }}
          margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
          align="center"
          colors={{ scheme: 'category10' }}
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.35}
          nodeThickness={18}
          nodeSpacing={24}
          nodeBorderWidth={0}
          nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
          nodeBorderRadius={3}
          linkOpacity={0.5}
          linkHoverOthersOpacity={0.1}
          linkBlendMode={
            theme.palette.mode === 'dark' ? 'difference' : 'normal'
          }
          linkContract={3}
          enableLinkGradient={true}
          labelPosition="inside"
          labelOrientation="horizontal"
          labelPadding={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
          // legends={[
          //   {
          //     anchor: 'bottom-right',
          //     direction: 'column',
          //     translateX: 130,
          //     itemWidth: 100,
          //     itemHeight: 14,
          //     itemDirection: 'right-to-left',
          //     itemsSpacing: 2,
          //     itemTextColor: '#999',
          //     symbolSize: 14,
          //     effects: [
          //       {
          //         on: 'hover',
          //         style: {
          //           itemTextColor: '#000',
          //         },
          //       },
          //     ],
          //   },
          // ]}
        />
      </Box>
      {/* <Box height={400} width={'100%'}>
        <ErrorBoundary
          fallback={<Typography variant="h6">Something went wrong.</Typography>}
        >
          <ResponsiveLine
            data={dataLine}
            enableArea
            areaBaselineValue={minimumAcrossSeries(dataLine)}
            areaBlendMode='normal'
            areaOpacity={0.5}
            theme={chartTheme}
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
            colors={{ datum: 'color' }}
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
            pointSize={4}
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
      </Box> */}
      <Box height={400} width={'100%'}>
        <ResponsiveHeatMap
          data={getHeatmapAffordability(
            { cashOnHand, annualIncome },
            assumptions,
          )}
          colors={s => {
            return Object({
              0: theme.palette.error.main,
              1: theme.palette.warning.main,
              2: theme.palette.warning.main,
              3: theme.palette.warning.main,
              4: theme.palette.success.main,
            })[s.data.y];
          }}
          emptyColor={theme.palette.background.paper}
          theme={chartTheme}
          margin={{
            top: 50,
            right: isMobile ? 0 : 130,
            bottom: 50,
            left: isMobile ? 50 : 100,
          }}
          valueFormat={formatCurrency}
          axisTop={null}
          axisLeft={{
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Monthly Payment',
            legendPosition: 'middle',
            legendOffset: -44,
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: isMobile ? -50 : 0,
            legend: 'Purchase Price',
            legendPosition: 'middle',
            legendOffset: 36,
            format: formatCurrency,
          }}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1.8]],
          }}
          tooltip={NivoTooltip}
          animate={true}
          // motionStiffness={90}
          // motionDamping={11}
          hoverTarget="cell"
          // cellHoverOthersOpacity={0.25}
          // cellOpacity={1}
          // cellBorderWidth={0}
          // cellBorderColor={{
          //   from: 'color',
          //   modifiers: [['darker', 0.4]],
          // }}
          enableLabels={true}
          annotations={[
            {
              type: 'circle',
              match: { serieId: '6000', value: 1.0 },
              noteX: 50,
              noteY: 50,
              noteTextOffset: 10,
              noteWidth: 80,
              offset: 3,
              note: 'Special Value',
            },
          ]}

          // label={d => formatCurrency(d.value)}
        />
      </Box>
      <Box height={400} width={'100%'}>
        <ResponsiveBar
          data={getTestSeriesData({ cashOnHand, annualIncome }, assumptions)}
          minValue={2000}
          keys={
            // ["High Risk - Savings",
            // "Medium Risk - Savings",
            // "Low Risk - Savings",
            // "Low Risk - Income",
            // "Medium Risk - Income",
            // "High Risk - Income",]
            [
              'lowDtiHighReserve',
              'lowDtiMediumReserve',
              'lowDtiLowReserve',

              'mediumDtiHighReserve',
              'mediumDtiMediumReserve',
              'mediumDtiLowReserve',

              'highDtiHighReserve',
              'highDtiMediumReserve',
              'highDtiLowReserve',
            ]
          }
          indexBy="index"
          defs={[
            // slashed green line
            pattern('green-lines', theme.palette.success.main),
            // slashed red line
            pattern('red-lines', theme.palette.error.main),
            // slashed yellow line
            pattern('yellow-lines', theme.palette.warning.main),
          ]}
          fill={[
            {
              id: 'green-lines',
              match: d => d.data.id.toString().includes('LowReserve'),
            },
            {
              id: 'yellow-lines',
              match: d => d.data.id.toString().includes('MediumReserve'),
            },
            {
              id: 'red-lines',
              match: d => d.data.id.toString().includes('HighReserve'),
            },
          ]}
          margin={{
            top: 50,
            right: isMobile ? 0 : 130,
            bottom: 50,
            left: isMobile ? 50 : 100,
          }}
          padding={isMobile ? 0.05 : 0.3}
          valueScale={{ type: 'linear', clamp: true }}
          indexScale={{ type: 'band', round: true }}
          theme={chartTheme}
          colors={barColors}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: isMobile ? -50 : 0,
            legend: 'Purchase Price',
            legendPosition: 'middle',
            legendOffset: 36,
            format: formatCurrency,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Monthly Payment',
            legendPosition: 'middle',
            legendOffset: -44,
          }}
          tooltip={NivoTooltip}
          valueFormat={formatCurrency}
          enableLabel={false}
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
