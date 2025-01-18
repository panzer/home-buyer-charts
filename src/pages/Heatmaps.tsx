import React from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import useMediaQuery from "@mui/material/useMediaQuery";

import TabPanel from "../components/TabPanel";
import PurchasePriceSelector from "../components/PurchasePriceSelector";
import DownPaymentSelector from "../components/DownPaymentSelector";
import InterestRateSelector from "../components/InterestRateSelector";
import CashOnHandSelector from "../components/CashOnHandSelector";
import IncomeSelector from "../components/IncomeSelector";
import PropertyCollection from "../components/PropertyCollection";
import NivoTooltip from "../components/NivoTooltip";

import { formatCurrency } from "../utils/currency";

import * as Math from "../utils/math";

function Heatmaps() {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [purchasePriceMin, setPurchasePriceMin] = React.useState(500_000);
  const [purchasePriceMax, setPurchasePriceMax] = React.useState(1_500_000);
  const [downPaymentMin, setDownPaymentMin] = React.useState(100_000);
  const [downPaymentMax, setDownPaymentMax] = React.useState(300_000);

  const [interestRate, setInterestRate] = React.useState(6.5); // APR
  const [cashOnHand, setCashOnHand] = React.useState(250_000);

  const [originationFeeRate, setOriginationFeeRate] = React.useState(1.0);
  const [originationFeeFixed, setOriginationFeeFixed] = React.useState(20_000);

  const [annualIncome, setAnnualIncome] = React.useState(230_000);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const sumMonthlyUtilities = 1_500;
  const sumOtherLifeEssentials = 1_500;

  const purchasePriceStep = 100_000;
  // const downPaymentStep = 20_000;
  const nStepsDownPayment = 6;
  const downPaymentStep =
    (downPaymentMax - downPaymentMin) / (nStepsDownPayment - 1);
  const numLoanPeriods = 360; // months
  const propertyTaxRate = 1.5; // APR
  const primaryMortgageInsuranceRate = 1.5; // APR of loan amount

  const plotLayoutDesktop: Partial<Plotly.Layout> = {
    margin: { t: 50, r: 0, l: 70, b: 50 },
    // paper_bgcolor: "transparent",
  };
  const plotLayoutMobile: Partial<Plotly.Layout> = {};
  const plotLayoutCommon: Partial<Plotly.Layout> = {
    autosize: true,
    width: 300,
    ...(isSmallScreen ? plotLayoutMobile : plotLayoutDesktop),
  };
  const plotConfigCommon: Partial<Plotly.Config> = {
    displaylogo: false,
    responsive: true,
  };

  // Convert the 2D arrays into a format that Nivo can understand
  const convertToNivoData = (
    data2DArray: number[][],
    xArray: number[],
    yArray: number[]
  ) =>
    yArray.map((yValue, yIndex) => {
      return {
        id: String(yValue),
        data: data2DArray[yIndex].map((cellValue, xIndex) => ({
          x: xArray[xIndex],
          y: cellValue,
        })),
      };
    });

  const downPaymentArray = new Array(
    (downPaymentMax - downPaymentMin) / downPaymentStep + 1
  )
    .fill(null)
    .map((_, index) => downPaymentMin + downPaymentStep * index);

  const purchasePriceArray = new Array(
    (purchasePriceMax - purchasePriceMin) / purchasePriceStep + 1
  )
    .fill(null)
    .map((_, index) => purchasePriceMin + purchasePriceStep * index);

  const dpArr = Math.duplicateRowAcross2DArray(
    downPaymentArray,
    purchasePriceArray.length
  );
  const ppArr = Math.duplicateColumnAcross2DArray(
    purchasePriceArray,
    downPaymentArray.length
  );
  const zerosArray = Math.multiplyNumberTo2DArray(ppArr, 0);

  const downPaymentPercentageArray = Math.divide2DArrays(dpArr, ppArr);
  const loanAmountArray = Math.subtract2DArrays(ppArr, dpArr);
  const mortgagePaymentMonthlyArray = Math.transformUnary2DArray(
    loanAmountArray,
    (la: number) => Math.PMT(interestRate / 100 / 12, numLoanPeriods, -la)
  );

  const downPaymentUnder20MaskArray = Math.addNumberTo2DArrayWithPredicate(
    zerosArray,
    1,
    (r: number, c: number) => downPaymentPercentageArray[r][c] < 0.2
  );

  const pmiMonthlyArray = Math.multiply2DArrays(
    downPaymentUnder20MaskArray,
    Math.multiplyNumberTo2DArray(
      loanAmountArray,
      primaryMortgageInsuranceRate / 100 / 12
    )
  );

  const propertyTaxMonthlyArray = Math.multiplyNumberTo2DArray(
    ppArr,
    propertyTaxRate / 100 / 12
  );

  const monthlyHousingCostArray = Math.add2DArrays(
    mortgagePaymentMonthlyArray,
    Math.add2DArrays(
      propertyTaxMonthlyArray,
      Math.addNumberTo2DArray(pmiMonthlyArray, sumMonthlyUtilities)
    )
  );

  const monthlyTotalEssentialsCostArray = Math.addNumberTo2DArray(
    monthlyHousingCostArray,
    sumOtherLifeEssentials
  );

  const otherPurchaseCosts = Math.addNumberTo2DArray(
    Math.multiplyNumberTo2DArray(ppArr, originationFeeRate / 100),
    originationFeeFixed
  );

  const cashLeftAfterPurchaseArray = Math.subtract2DArrayFromNumber(
    cashOnHand,
    Math.add2DArrays(dpArr, otherPurchaseCosts)
  );

  const numMonthsExpensesSavedArray = Math.divide2DArrays(
    cashLeftAfterPurchaseArray,
    monthlyTotalEssentialsCostArray
  );

  const debtToIncomeRatio = Math.divideNumberTo2DArray(
    monthlyTotalEssentialsCostArray,
    annualIncome / 1200 // so that percent is displayed out of 100
  );
  const monthlyHousingCostData = convertToNivoData(
    monthlyHousingCostArray,
    purchasePriceArray,
    downPaymentArray
  );
  const cashLeftAfterPurchaseData = convertToNivoData(
    cashLeftAfterPurchaseArray,
    purchasePriceArray,
    downPaymentArray
  );
  const numMonthsExpensesSavedData = convertToNivoData(
    numMonthsExpensesSavedArray,
    purchasePriceArray,
    downPaymentArray
  );
  const debtToIncomeRatioData = convertToNivoData(
    debtToIncomeRatio,
    purchasePriceArray,
    downPaymentArray
  );

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  console.log(monthlyHousingCostData);

  return (
    <div className="App">
      <Stack
        margin={2}
        marginTop={12}
        sx={{ flexDirection: { sm: "column", md: "row" } }}
      >
        <Box>
          <PurchasePriceSelector
            defaultLowerValue={200}
            defaultUpperValue={950}
            onSelectLower={setPurchasePriceMin}
            onSelectUpper={setPurchasePriceMax}
          />
          <DownPaymentSelector
            defaultLowerValue={80}
            defaultUpperValue={300}
            onSelectLower={setDownPaymentMin}
            onSelectUpper={setDownPaymentMax}
          />
          <CashOnHandSelector
            defaultValue={cashOnHand}
            onSelect={setCashOnHand}
          />
          <InterestRateSelector
            defaultValue={interestRate}
            onSelect={setInterestRate}
          />
          <IncomeSelector
            defaultValue={annualIncome}
            onSelect={setAnnualIncome}
          />
        </Box>
        <Box>
          <Tabs
            value={selectedTab}
            onChange={(event, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
          >
            <Tab label="Housing Cost" {...a11yProps(0)} />
            <Tab label="Cash Remaining" {...a11yProps(1)} />
            <Tab label="Monthly Safety Net" {...a11yProps(2)} />
            <Tab label="Debt To Income" {...a11yProps(3)} />
          </Tabs>
          <Box paddingY={2} paddingX={0}>
            <TabPanel
              value={selectedTab}
              index={0}
              innerSx={{
                height: isSmallScreen ? "400px" : "600px",
              }}
            >
              <ResponsiveHeatMap
                data={monthlyHousingCostData}
                valueFormat=">-.2s"
                colors={{ type: "sequential", scheme: "blues" }}
                // colors={(cell)=>cell.value}
                // keys={purchasePriceArray}
                // indexBy="id"
                margin={{ top: 0, right: 0, bottom: 60, left: 60 }}
                // colors="cividis"
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -30,
                  legend: "Purchase Price ($)",
                  legendOffset: 36,
                  format: formatCurrency,
                  tickValues: 4,
                }}
                axisLeft={{
                  // orient: "left",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Down Payment ($)",
                  legendPosition: "middle",
                  legendOffset: -50,
                  format: formatCurrency,
                  tickValues: 4,
                }}
                axisRight={null}
                axisTop={null}
                tooltip={NivoTooltip}
              />
            </TabPanel>
            <TabPanel
              value={selectedTab}
              index={1}
              innerSx={{
                height: isSmallScreen ? "400px" : "600px",
              }}
            >
              <ResponsiveHeatMap
                data={cashLeftAfterPurchaseData}
                // keys={purchasePriceArray}
                // indexBy="id"
                margin={{ top: 100, right: 60, bottom: 60, left: 60 }}
                // colors="RdBu"
                axisTop={{
                  // orient: "top",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -90,
                  legend: "Purchase Price ($)",
                  legendOffset: 36,
                }}
                axisRight={null}
                axisBottom={null}
                axisLeft={{
                  // orient: "left",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Down Payment ($)",
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
              />
            </TabPanel>
            <TabPanel
              value={selectedTab}
              index={2}
              innerSx={{
                height: isSmallScreen ? "400px" : "600px",
              }}
            >
              <ResponsiveHeatMap
                data={numMonthsExpensesSavedData}
                // keys={purchasePriceArray}
                // indexBy="id"
                margin={{ top: 100, right: 60, bottom: 60, left: 60 }}
                // colors="Portland"
                axisTop={{
                  // orient: "top",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -90,
                  legend: "Purchase Price ($)",
                  legendOffset: 36,
                }}
                axisRight={null}
                axisBottom={null}
                axisLeft={{
                  // orient: "left",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Down Payment ($)",
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
              />
            </TabPanel>
            <TabPanel
              value={selectedTab}
              index={3}
              innerSx={{
                height: isSmallScreen ? "400px" : "600px",
              }}
            >
              <ResponsiveHeatMap
                data={debtToIncomeRatioData}
                // keys={purchasePriceArray}
                // indexBy="id"
                margin={{ top: 100, right: 60, bottom: 60, left: 60 }}
                // colors="Portland"
                axisTop={{
                  // orient: "top",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -90,
                  legend: "Purchase Price ($)",
                  legendOffset: 36,
                }}
                axisRight={null}
                axisBottom={null}
                axisLeft={{
                  // orient: "left",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Down Payment ($)",
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
              />
            </TabPanel>
          </Box>
        </Box>
        {/* <PropertyCollection onChange={(p) => console.log(p)} /> */}
      </Stack>
    </div>
  );
}

export default Heatmaps;
