export type Expense = {
  name: string;
  amount: number;
  enabled?: boolean;
  icon?: string;
};

export type ExpenseRecurring = Expense & {
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "annually";
};

