export type Expense = {
  name: string;
  amount: number;
  enabled?: boolean;
  icon?: string;
};

export type ExpenseRecurring = Expense & {
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "annually";
};

export function sumRecurringExpenses(expenses: ExpenseRecurring[]): number {
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

export function sumExpenses(expenses: Expense[]): number {
  return expenses.reduce((accum, expense) => expense.enabled !== false ? accum + expense.amount : accum, 0)
}
