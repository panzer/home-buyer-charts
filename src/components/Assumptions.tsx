import React from "react";

import { styled, darken, lighten } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Expense, ExpenseRecurring } from ".";

import ItemizedAssumptionsEditor from "../components/ItemizedAssumptionsEditor";

function sumExpenses(expenses: ExpenseRecurring[]): number {
  let annualTotal = 0;
  expenses.forEach((expense) => {
    if (expense.enabled !== false) {
      // Only sum enabled expenses, or those without an 'enabled' field
      switch (expense.frequency) {
        case "daily":
          annualTotal += expense.amount * 365;
          break;
        case "weekly":
          annualTotal += expense.amount * 52;
          break;
        case "biweekly":
          annualTotal += expense.amount * 26;
          break;
        case "monthly":
          annualTotal += expense.amount * 12;
          break;
        case "annually":
          annualTotal += expense.amount;
          break;
      }
    }
  });
  return annualTotal;
}

type Assumptions = {
  maximumDti: number;
  minimumDownPaymentPerc: number;

  sumOtherDebts: number;

  sumClosingCostFixed: number;
  closingCostPercOfPurchase: number;

  propertyTaxRate: number;
  includeUtilities: boolean;
  sumMonthlyUtilities: number;

  nMonthLoanTerm: number;
  loanApr: number;

  itemized: ItemizedAssumptions;
};

type ItemizedAssumptions = {
  otherDebts: ExpenseRecurring[];
  closingCosts: Expense[];
  monthlyHousing: Expense[];
};

type AssumptionsProps = {
  initialValue?: Partial<Assumptions>;
  onChange?: (assumptions: Assumptions) => void;
};

const defaultAssumptions: Assumptions = {
  maximumDti: 0.43,
  minimumDownPaymentPerc: 0.03,

  sumOtherDebts: 0,

  sumClosingCostFixed: 1000,
  closingCostPercOfPurchase: 0.03,

  propertyTaxRate: 0.01,
  includeUtilities: true,
  sumMonthlyUtilities: 300,

  nMonthLoanTerm: 360,
  loanApr: 0.07,

  itemized: {
    otherDebts: [],
    closingCosts: [],
    monthlyHousing: [
      {
        name: "Water / Sewer",
        amount: 100,
      },
      {
        name: "Gas",
        amount: 100,
      },
      {
        name: "Electricity",
        amount: 100,
      },
      {
        name: "Internet",
        amount: 40,
      },
    ],
  },
};

const AlternatingRowsContainer = styled(Grid)(
  ({ theme }) => `
  > div:nth-of-type(even) {
    background-color: ${
      theme.palette.mode === "dark"
        ? lighten(theme.palette.background.paper, 0.03)
        : darken(theme.palette.background.paper, 0.05)
    };
  }
  > div:hover {
    transition: background-color 400ms 100ms;
    background-color: ${
      theme.palette.mode === "dark"
        ? theme.palette.primary.main
        : theme.palette.primary.light
    };
  }
  > div:hover button {
   transition: color 400ms 100ms;
    color: ${theme.palette.text.primary};
  }
`
);

const AssumptionsComponent: React.FC<AssumptionsProps> = (props) => {
  const { initialValue = {}, onChange } = props;
  const {
    nMonthLoanTerm = defaultAssumptions.nMonthLoanTerm,
    loanApr = defaultAssumptions.loanApr,
    maximumDti = defaultAssumptions.maximumDti,
    minimumDownPaymentPerc = defaultAssumptions.minimumDownPaymentPerc,
    closingCostPercOfPurchase = defaultAssumptions.closingCostPercOfPurchase,
    propertyTaxRate = defaultAssumptions.propertyTaxRate,
    includeUtilities = defaultAssumptions.includeUtilities,
    sumMonthlyUtilities,
    sumOtherDebts = defaultAssumptions.sumOtherDebts,
    sumClosingCostFixed = defaultAssumptions.sumClosingCostFixed,
    itemized,
  } = initialValue;

  const otherDebts =
    itemized?.otherDebts ?? defaultAssumptions.itemized.otherDebts;
  const closingCosts =
    itemized?.closingCosts ?? defaultAssumptions.itemized.closingCosts;
  const monthlyHousing =
    itemized?.monthlyHousing ?? defaultAssumptions.itemized.monthlyHousing;

  const [isEditorOpen, setIsEditorOpen] = React.useState(false);

  type ItemRowType = {
    name: string;
    value: string;
    datum?: string;
    onClick?: () => void;
    subItems?: ItemRowType[];
  };
  function ItemRow(itemRow: ItemRowType): React.ReactNode {
    const name = itemRow.onClick ? (
      <Typography variant="body2" align="left">
        <Link component="button" color="info" onClick={itemRow.onClick}>
          {itemRow.name}
        </Link>
      </Typography>
    ) : (
      <Typography variant="body2" align="left">
        {itemRow.name}
      </Typography>
    );
    return (
      <Grid container size={6} borderRadius={0.5}>
        <Grid container size={6} paddingX={{ xs: 1, md: 3 }}>
          <Grid size={3}>{name}</Grid>
          <Grid size={1}>
            <Typography variant="body2" align="right">
              {itemRow.value}
            </Typography>
          </Grid>
          <Grid size={2}>
            <Typography
              variant="body2"
              align="right"
              fontStyle="italic"
              sx={{ color: (theme) => theme.palette.text.secondary }}
            >
              {itemRow.datum}
            </Typography>
          </Grid>
        </Grid>
        {itemRow.subItems?.map((subItemRow) =>
          ItemRow({ ...subItemRow, name: "↳ " + subItemRow.name })
        )}
      </Grid>
    );
  }

  function AssumptionSection(subtitle: string, rows: ItemRowType[]) {
    return (
      <Grid
        size={{ xs: 12, md: 6 }}
        component={Paper}
        // variant="outlined"
        padding={1}
      >
        <Typography variant="subtitle1">{subtitle}</Typography>
        <AlternatingRowsContainer container columns={6}>
          {rows.map((itemRow, index) => ItemRow(itemRow))}
        </AlternatingRowsContainer>
      </Grid>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, maxWidth: "md" }}>
      <Typography variant="h6" gutterBottom>
        Assumptions Overview
      </Typography>
      <Grid container spacing={2}>
        {AssumptionSection("Loan Terms", [
          { name: "Length", value: `${nMonthLoanTerm / 12}`, datum: "years" },
          {
            name: "Interest Rate",
            value: `${(loanApr * 100).toFixed(2)}%`,
            datum: "APR",
          },
        ])}
        {AssumptionSection("Debt-to-Income (DTI) & Down Payment", [
          { name: "Maximum DTI", value: `${maximumDti * 100}%` },
          {
            name: "Minimum Down Payment",
            value: `${minimumDownPaymentPerc * 100}%`,
            datum: "of purchase price",
          },
        ])}
        {AssumptionSection("Debts & Closing Costs", [
          { name: "Sum of Other Debts", value: `$${sumOtherDebts}` },
          { name: "Fixed Closing Costs", value: `$${sumClosingCostFixed}` },
          {
            name: "Closing Costs",
            value: `${closingCostPercOfPurchase * 100}%`,
            datum: "of purchase price",
          },
        ])}
        {AssumptionSection("Property Tax & Utilities", [
          {
            name: "Property Tax Rate",
            value: `${propertyTaxRate * 100}%`,
            datum: "of property value",
          },
          { name: "Include Utilities", value: includeUtilities ? "Yes" : "No" },
          {
            name: "Sum of Utilities",
            value: `$${sumMonthlyUtilities}`,
            datum: "per month",
            onClick: () => setIsEditorOpen(true),
            subItems: monthlyHousing.map((expense) => ({
              name: expense.name,
              value: `$${expense.amount}`,
              datum: "/mo",
            })),
          },
        ])}
      </Grid>
      <ItemizedAssumptionsEditor
        slots={{
          dialog: {
            open: isEditorOpen,
            onClose: () => setIsEditorOpen(false),
            title: "Edit Expenses",
          },
        }}
        initialValue={monthlyHousing}
        onSave={console.log}
      />
    </Paper>
  );
};

export default AssumptionsComponent;
