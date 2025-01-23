import React from "react";
import { ResponsiveBar } from "@nivo/bar";
// import { ResponsiveLine } from '@nivo/line';
// import { ResponsivePie } from '@nivo/pie';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IncomeSelector from "../components/IncomeSelector";
import CashOnHandSelector from "../components/CashOnHandSelector";
import AssumptionsComponent, {Assumptions} from "../components/Assumptions";

const AffordabilityReport = () => {
  const [cashOnHand, setCashOnHand] = React.useState(250_000);
  const [annualIncome, setAnnualIncome] = React.useState(230_000);
  const [assumptions, setAssumptions] = React.useState<Assumptions>();

  const {maximumDti, itemizedOtherDebts} = assumptions as Assumptions;
  const totalOtherDebtsMonthly = 0;
  
  const monthlyIncome = annualIncome / 12.0;
  const limitMonthlyDti = monthlyIncome * maximumDti - totalOtherDebtsMonthly;
  const limitDownPayment = 0;

  // Mock data, replace with actual data sources
  const dataBar = [
    {
      id: "Limited by Debt-to-Income",
      value: limitMonthlyDti,
    },
    {
      id: "Limited by Down Payment",
      value: limitDownPayment,
    },
  ];
  const dataLine = [
    // Replace with actual data
  ];
  const dataPie = [
    // Replace with actual data
  ];

  return (
    <Stack spacing={2} alignItems={"center"}>
      <Typography variant="h4" gutterBottom>
        Home Affordability Report
      </Typography>
      <Box>
        <IncomeSelector />
        <CashOnHandSelector onSelect={(x) => setCashOnHand(x)} />
      </Box>

      <AssumptionsComponent onChange={(a) => console.log("updating assumptions", a)}/>
      {/* Insert Nivo charts here based on the affordability report outline */}
      {/* Example Bar Chart */}
      <Box height={400}>
        <ResponsiveBar
          data={dataBar}
          keys={['value']}
          indexBy="id"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
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
            legendOffset: 32
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'value',
            legendPosition: 'middle',
            legendOffset: -40
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
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          animate={true}
          // motionStiffness={90}
          // motionDamping={15}
        />
      </Box>
      {/* Example Line Chart */}
      <Box height={400}>
        {/* <ResponsiveLine
          data={dataLine}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'transportation',
            legendOffset: 36,
            legendPosition: 'middle'
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          colors={{ scheme: 'nivo' }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="y"
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
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
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        /> */}
      </Box>
      {/* Example Pie Chart */}
      {/* <Box height={400}>
        <ResponsivePie
          data={dataPie}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: 'nivo' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          radialLabelsSkipAngle={10}
          radialLabelsTextColor="#333333"
          radialLabelsLinkColor={{ from: 'color' }}
          sliceLabelsSkipAngle={10}
          sliceLabelsTextColor="#333333"
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              translateY: 56,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000'
                  }
                }
              ]
            }
          ]}
        /> */}
      {/* </Box> */}
    </Stack>
  );
};

export default AffordabilityReport;
