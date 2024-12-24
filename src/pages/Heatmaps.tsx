import React from "react";
import Plot from "react-plotly.js";
import * as Plotly from "plotly.js";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import NavBar from "../components/NavBar";
import TabPanel from "../components/TabPanel";
import PurchasePriceSelector from "../components/PurchasePriceSelector";
import DownPaymentSelector from "../components/DownPaymentSelector";
import InterestRateSelector from "../components/InterestRateSelector";
import CashOnHandSelector from "../components/CashOnHandSelector";
import IncomeSelector from "../components/IncomeSelector";
import PropertyCollection from "../components/PropertyCollection";

import * as Math from "../utils/math";

function Heatmaps() {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [purchasePriceMin, setPurchasePriceMin] = React.useState(500_000);
  const [purchasePriceMax, setPurchasePriceMax] = React.useState(1_500_000);
  const [downPaymentMin, setDownPaymentMin] = React.useState(30_000);
  const [downPaymentMax, setDownPaymentMax] = React.useState(300_000);

  const [interestRate, setInterestRate] = React.useState(6.5); // APR
  const [cashOnHand, setCashOnHand] = React.useState(250_000);

  const [originationFeeRate, setOriginationFeeRate] = React.useState(1.0);
  const [originationFeeFixed, setOriginationFeeFixed] = React.useState(20_000);

  const [annualIncome, setAnnualIncome] = React.useState(230_000);

  const [revision, setRevision] = React.useState(0);

  React.useEffect(() => {
    setRevision((r) => r + 1);
  }, [
    purchasePriceMin,
    purchasePriceMax,
    downPaymentMin,
    downPaymentMax,
    interestRate,
    cashOnHand,
    originationFeeRate,
    originationFeeFixed,
  ]);

  const sumMonthlyUtilities = 1_500;
  const sumOtherLifeEssentials = 1_500;

  const purchasePriceStep = 10_000;
  const downPaymentStep = 5_000;
  const numLoanPeriods = 360; // months
  const propertyTaxRate = 1.5; // APR
  const primaryMortgageInsuranceRate = 1.5; // APR of loan amount

  const plotLayoutCommon = {
    margin: { t: 50, r: 0, l: 70, b: 50 },
    // paper_bgcolor: "transparent",
  };
  const plotConfigCommon = {
    displaylogo: false,
    responsive: false,
  };

  const selectedHomesPlotData: Plotly.Data = {
    type: "scatter",
    mode: "markers",
    hovertext: ["Home1", "Home2"],
    x: [550_000, 650_500],
    y: [185_000, 190_000],
    hoverinfo: "text",
    marker: {
      color: "black",
    },
  };

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

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <div className="App">
      <NavBar />
      <Stack direction={"row"} margin={2}>
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
          >
            <Tab label="Housing Cost" {...a11yProps(0)} />
            <Tab label="Cash Remaining" {...a11yProps(1)} />
            <Tab label="Monthly Safety Net" {...a11yProps(2)} />
            <Tab label="Debt To Income" {...a11yProps(3)} />
          </Tabs>
          <Box bgcolor={"lightgray"}>
            <TabPanel value={selectedTab} index={0}>
              <Plot
                data={[
                  {
                    type: "heatmap",
                    x: purchasePriceArray,
                    y: downPaymentArray,
                    z: monthlyHousingCostArray,
                    hoverinfo: "x+y+z",
                    colorscale: "Cividis",
                    reversescale: false,
                    colorbar: {
                      title: "Monthly Housing Cost ($)",
                      titleside: "right",
                    },
                    uirevision: revision,
                  },
                  selectedHomesPlotData,
                ]}
                layout={{
                  title: "Monthly Housing Cost",
                  xaxis: { title: "Purchase Price ($)" },
                  yaxis: { title: "Down Payment ($)" },
                  ...plotLayoutCommon,
                }}
                config={plotConfigCommon}
              />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <Plot
                data={[
                  {
                    type: "heatmap",
                    x: purchasePriceArray,
                    y: downPaymentArray,
                    z: cashLeftAfterPurchaseArray,
                    hoverinfo: "x+y+z",
                    zmin: 0,
                    zmax: cashOnHand,
                    colorscale: "RdBu",
                    reversescale: true,
                    colorbar: {
                      title: "Cash Left After Purchase ($)",
                      titleside: "right",
                    },
                    uirevision: revision,
                  },
                  selectedHomesPlotData,
                ]}
                layout={{
                  title: "Cash Left After Purchase",
                  xaxis: { title: "Purchase Price ($)" },
                  yaxis: { title: "Down Payment ($)" },
                  ...plotLayoutCommon,
                }}
                config={plotConfigCommon}
              />
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
              <Plot
                data={[
                  {
                    type: "heatmap",
                    x: purchasePriceArray,
                    y: downPaymentArray,
                    z: numMonthsExpensesSavedArray,
                    hoverinfo: "x+y+z",
                    zmin: 3,
                    zmax: 12,
                    colorscale: "Portland",
                    reversescale: true,
                    colorbar: {
                      title: "Months of Expenses Saved",
                      titleside: "right",
                    },
                    uirevision: revision,
                  },
                  selectedHomesPlotData,
                ]}
                layout={{
                  title: "Number of Months of Expenses Saved",
                  xaxis: { title: "Purchase Price ($)" },
                  yaxis: { title: "Down Payment ($)" },
                  ...plotLayoutCommon,
                }}
                config={plotConfigCommon}
              />
            </TabPanel>
            <TabPanel value={selectedTab} index={3}>
              <Plot
                data={[
                  {
                    type: "heatmap",
                    name: "DTI",
                    x: purchasePriceArray,
                    y: downPaymentArray,
                    z: debtToIncomeRatio,
                    hoverinfo: "x+y+z",
                    zmin: 20,
                    zmax: 42,
                    colorscale: "Portland",
                    colorbar: {
                      title: "DTI (%)",
                      titleside: "right",
                    },
                    // transpose: true,
                    uirevision: revision,
                  },
                  selectedHomesPlotData,
                ]}
                layout={{
                  title: "Debt to Income Ratio",
                  xaxis: { title: "Purchase Price ($)" },
                  yaxis: { title: "Down Payment ($)" },
                  ...plotLayoutCommon,
                }}
                config={plotConfigCommon}
              />
            </TabPanel>
          </Box>
        </Box>
        <PropertyCollection onChange={(p) => console.log(p)} />
      </Stack>

      {/* <Plot
        data={[
          {
            type: "heatmap",
            x: purchasePriceArray,
            y: downPaymentArray,
            z: mortgagePaymentMonthlyArray,
            colorscale: "Viridis",
            reversescale: true,
            colorbar: {
              title: "Monthly Mortgage Payment ($)",
              titleside: "right",
            },
            transpose: true,
          },
        ]}
        layout={{
          title: "Monthly Mortgage Payment",
          xaxis: { title: "Purchase Price ($)" },
          yaxis: { title: "Down Payment ($)" },
          margin: { t: 50, r: 0, l: 70, b: 50 },
        }}
        config={{
          displaylogo: false,
          responsive: true,
        }}
      /> */}
      {/* <Plot
        data={[
          {
            type: "heatmap",
            x: purchasePriceArray,
            y: downPaymentArray,
            z: pmiMonthlyArray,
            colorscale: "Portland",
            reversescale: false,
            colorbar: {
              title: "Monthly PMI ($)",
              titleside: "right",
            },
            transpose: true,
          },
        ]}
        layout={{
          title: "Monthly PMI",
          xaxis: { title: "Purchase Price ($)" },
          yaxis: { title: "Down Payment ($)" },
          margin: { t: 50, r: 0, l: 70, b: 50 },
        }}
        config={{
          displaylogo: false,
          responsive: true,
        }}
      /> */}
    </div>
  );
}

export default Heatmaps;
