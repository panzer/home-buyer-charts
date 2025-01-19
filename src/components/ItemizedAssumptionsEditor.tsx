import React from "react";

import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";

import { Expense, ExpenseRecurring } from ".";

type SomeExpenses = Expense[] | ExpenseRecurring[];

type ItemizedAssumptionsEditorProps = {
  initialValue: SomeExpenses;
  onSave: (result: SomeExpenses) => void;
  slots: { dialog: DialogProps };
};

const ItemizedAssumptionsEditor: React.FC<ItemizedAssumptionsEditorProps> = (
  props
) => {
  const formValues = props.initialValue;
  const dialogProps = props.slots.dialog;
  return (
    <Dialog
      {...dialogProps}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          console.log(formJson);
          dialogProps.onClose?.({}, "escapeKeyDown");
          props.onSave([]);
        },
      }}
    >
      <DialogTitle>{dialogProps.title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid container size={12}>
            <Grid size={7}>Expense</Grid>
            <Grid size={3} textAlign="right">
              $/mo
            </Grid>
            <Grid size={2}></Grid>
          </Grid>
          {formValues.map((value, index) => (
            <Grid container key={index} size={12}>
              <Grid size={"grow"}>
                <TextField
                  name={`[${index}].name`}
                  hiddenLabel
                  defaultValue={value.name}
                  variant="filled"
                  size="small"
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  name={`[${index}].amount`}
                  hiddenLabel
                  defaultValue={value.amount}
                  variant="filled"
                  size="small"
                  slotProps={{ htmlInput: { style: { textAlign: "right" } } }}
                />
              </Grid>
              <Grid size={2}>
                <IconButton aria-label="delete">
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid container size={12}>
            <Grid size={"grow"}>
              <TextField hiddenLabel variant="filled" size="small" />
            </Grid>
            <Grid size={3}>
              <TextField hiddenLabel variant="filled" size="small" />
            </Grid>
            <Grid size={2}>
              <IconButton>
                <Add />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            dialogProps.onClose?.({}, "escapeKeyDown");
          }}
        >
          Cancel
        </Button>
        <Button type="submit" color="success">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemizedAssumptionsEditor;
