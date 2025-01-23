import React from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Expense, ExpenseRecurring } from "..";

import ItemizedAssumptionsEditor from "../ItemizedAssumptionsEditor";
import AssumptionSection from "./AssumptionsSection";


function sumRecurringExpenses(expenses: ExpenseRecurring[]): number {
  let annualTotal = 0;
  expenses.forEach((expense) => {
    if (expense.enabled !== false) {
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

function sumExpenses(expenses: Expense[]): number {
  return expenses.reduce((accum, expense) => expense.enabled !== false ? accum + expense.amount : accum, 0)
}

export type Assumptions = {
  maximumDti: number;
  minimumDownPaymentPerc: number;
  minimumMonthsExpensesReserved: number;

  sumOtherDebts: number;

  sumClosingCostFixed: number;
  closingCostPercOfPurchase: number;

  propertyTaxRate: number;
  includeUtilities: boolean;
  sumMonthlyUtilities: number;
  hoaMonthly: number;
  nMonthLoanTerm: number;
  loanApr: number;

  itemizedMonthlyHousing: Expense[];
  itemizedOtherDebts: ExpenseRecurring[];
  itemizedClosingCosts: Expense[];
};

type AssumptionsProps = {
  initialValue?: Partial<Assumptions>;
  onChange?: (assumptions: Assumptions) => void;
};

const defaultAssumptions: Assumptions = {
  maximumDti: 0.43,
  minimumDownPaymentPerc: 0.03,
  minimumMonthsExpensesReserved: 3,

  sumOtherDebts: 0,

  sumClosingCostFixed: 1000,
  closingCostPercOfPurchase: 0.03,

  propertyTaxRate: 0.01,
  includeUtilities: true,
  sumMonthlyUtilities: 300,
  hoaMonthly: 0,

  nMonthLoanTerm: 360,
  loanApr: 0.07,

    itemizedOtherDebts: [
      {
        name: "Car Payment",
        amount: 0,
        frequency: "monthly",
      },
      {
        name: "Student Loans",
        amount: 0,
        frequency: "monthly",
      },
    ],
    itemizedClosingCosts: [{
      name: "Inspection",
      amount: 500,
    },
    {
      name: "Moving",
      amount: 800,
    },
    {
      name: "Title",
      amount: 100,
    },
  ],
    itemizedMonthlyHousing: [
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
};



const AssumptionsComponent: React.FC<AssumptionsProps> = (props) => {
  const { initialValue = {}, onChange } = props;
  const [assumptionsValue, setAssumptionsValue] = React.useState<Assumptions>({...defaultAssumptions, ...initialValue})
  const {
    nMonthLoanTerm,
    loanApr,
    maximumDti,
    minimumDownPaymentPerc,
    minimumMonthsExpensesReserved,
    closingCostPercOfPurchase ,
    propertyTaxRate ,
    hoaMonthly,
    includeUtilities,
    sumMonthlyUtilities,
    sumOtherDebts,
    sumClosingCostFixed,
    itemizedMonthlyHousing,
    itemizedClosingCosts,
    itemizedOtherDebts,
  } = assumptionsValue;

    const editorValues = {
      itemizedMonthlyHousing,
    itemizedClosingCosts,
    itemizedOtherDebts,
    };
    const [editingValues, setEditingValues] = React.useState<"none" | keyof typeof editorValues>("none");
  const isEditorOpen = React.useMemo(() => editingValues !== "none", [editingValues]);
  const editorInitialValue = React.useMemo(() => editingValues !== "none" ? editorValues[editingValues] : [], [editingValues]);
  const editorOnSave = React.useMemo(() => (data: Expense[] | ExpenseRecurring[]) => {
    // console.log(`saving ${editingValues}`, data)
    setAssumptionsValue({...assumptionsValue, [editingValues]: data})
  }, [editingValues])

  React.useEffect(()=>{
    onChange?.(assumptionsValue)
  }, [onChange, assumptionsValue])

  return (
    <Paper variant="outlined" sx={{ p: 2, maxWidth: "md" }}>
      <Typography variant="h6" gutterBottom>
        Assumptions Overview
      </Typography>
      <Grid container spacing={2}>
        <AssumptionSection subtitle="Loan Terms and Closing Costs" rows={[
          { name: "Length", value: `${nMonthLoanTerm / 12}`, datum: "years" },
          {
            name: "Interest Rate",
            value: `${(loanApr * 100).toFixed(2)}%`,
            datum: "APR",
          },
          {
            name: "Fixed Closing Costs",
            value: `$${sumExpenses(itemizedClosingCosts)}`,
            onClick: () => setEditingValues("itemizedClosingCosts"),
            subItems: itemizedClosingCosts.map((expense) => ({name: expense.name, value: `$${expense.amount}`})) },
          {
            name: "Closing Costs",
            value: `${closingCostPercOfPurchase * 100}%`,
            datum: "of purchase price",
          },
        ]} />
        <AssumptionSection subtitle="Debt-to-Income (DTI) & Down Payment" rows={[
          { name: "Maximum DTI", value: `${maximumDti * 100}%` },
          {
            name: "Minimum Down Payment",
            value: `${minimumDownPaymentPerc * 100}%`,
            datum: "of purchase price",
          },
          {
            name: "Min. Expenses Held Post-Purchase",
            value: `${minimumMonthsExpensesReserved}`,
            datum: "months",
          },
        ]} />
        <AssumptionSection subtitle="Debts & Closing Costs" rows={[
          {
            name: "Sum of Other Debts",
            value: `$${sumExpenses(itemizedOtherDebts)}`,
            datum: "per month",
            onClick: () => setEditingValues("itemizedOtherDebts"),
            subItems: itemizedOtherDebts?.map((expense) => ({
              name: expense.name,
              value: `$${expense.amount}`,
              datum: "/mo",
            })),
          },
          
        ]} />
        <AssumptionSection subtitle="Property Tax & Housing Costs" rows={[
          {
            name: "Property Tax Rate",
            value: `${propertyTaxRate * 100}%`,
            datum: "of property value",
          },
          {
            name: "Home Owner's Assn. (HOA)",
            value: `$${hoaMonthly}`,
            datum: "per month",
          },
          { name: "Include Utilities", value: includeUtilities ? "Yes" : "No" },
          {
            name: "Sum of Utilities",
            value: `$${sumExpenses(itemizedMonthlyHousing)}`,
            datum: "per month",
            onClick: () => setEditingValues("itemizedMonthlyHousing"),
            subItems: itemizedMonthlyHousing.map((expense) => ({
              name: expense.name,
              value: `$${expense.amount}`,
              datum: "/mo",
            })),
          },
        ]} />
      </Grid>
      <ItemizedAssumptionsEditor
        slots={{
          dialog: {
            open: isEditorOpen,
            onClose: () => setEditingValues("none"),
            title: "Edit Expenses",
          },
        }}
        initialValue={editorInitialValue}
        onSave={editorOnSave}
      />
    </Paper>
  );
};

export default AssumptionsComponent;
