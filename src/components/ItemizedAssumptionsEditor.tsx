import React from 'react';

import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';

import { Expense, ExpenseRecurring } from '.';

type SomeExpenses = Expense[];

type ItemizedAssumptionsEditorProps = {
  initialValue: SomeExpenses;
  onSave: (result: SomeExpenses) => void;
  slots: { dialog: DialogProps };
};

function parseFormData<T extends SomeExpenses>(d: object): T {
  // takes data like {
  //   "[0].name": "Water / Sewer",
  //   "[0].amount": "100",
  //   "[1].name": "Gas",
  //   "[1].amount": "200",
  // }
  // returns [{name: "Water / Sewer", amount: 100}, {name: "Gas", amount: 200}]
  const result = [];
  const keys = Object.keys(d).sort();

  let currentIndex = -1;
  let currentObj: any = {};

  for (const key of keys) {
    const match = key.match(/\[(\d+)\]\.(\w+)/);
    if (!match) continue;

    const [_, indexStr, field] = match;
    const index = parseInt(indexStr);

    if (index !== currentIndex) {
      if (Object.keys(currentObj).length > 0) {
        result.push(currentObj);
      }
      currentObj = {};
      currentIndex = index;
    }

    const value = (d as any)[key];
    currentObj[field] = field === 'amount' ? parseFloat(value) : value;
  }

  if (Object.keys(currentObj).length > 0) {
    result.push(currentObj);
  }

  return result as T;
}

const ItemizedAssumptionsEditor: React.FC<
  ItemizedAssumptionsEditorProps
> = props => {
  const [formValues, setFormValues] = React.useState<SomeExpenses>(
    props.initialValue,
  );
  const makeNewRow = () => ({ name: '', amount: 0 });
  const [newRow, setNewRow] = React.useState<Expense>(makeNewRow());

  const dialogProps = props.slots.dialog;

  React.useEffect(() => {
    if (dialogProps.open) {
      setFormValues(props.initialValue);
    }
  }, [dialogProps.open, props.initialValue]);

  return (
    <Dialog
      {...dialogProps}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          console.log(formJson);
          dialogProps.onClose?.({}, 'escapeKeyDown');
          props.onSave(parseFormData<SomeExpenses>(formJson));
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
            <Grid container key={index + value.name + value.amount} size={12}>
              <Grid size={'grow'}>
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
                  slotProps={{ htmlInput: { style: { textAlign: 'right' } } }}
                />
              </Grid>
              <Grid size={2}>
                <IconButton
                  aria-label="delete"
                  onClick={() =>
                    setFormValues([
                      ...formValues.slice(0, index),
                      ...formValues.slice(index + 1),
                    ])
                  }
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid container size={12}>
            <Grid size={'grow'}>
              <TextField
                hiddenLabel
                variant="filled"
                size="small"
                value={newRow.name}
                onChange={event =>
                  setNewRow({ ...newRow, name: event.target.value })
                }
              />
            </Grid>
            <Grid size={3}>
              <TextField
                hiddenLabel
                variant="filled"
                size="small"
                value={newRow.amount}
                slotProps={{ htmlInput: { style: { textAlign: 'right' } } }}
                onChange={event =>
                  setNewRow({
                    ...newRow,
                    amount: parseFloat(event.target.value) || 0,
                  })
                }
              />
            </Grid>
            <Grid size={2}>
              <IconButton
                aria-label="add item"
                disabled={!newRow.name}
                onClick={() => {
                  setFormValues(formValues.concat(newRow));
                  setNewRow(makeNewRow());
                }}
              >
                <Add />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            dialogProps.onClose?.({}, 'escapeKeyDown');
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
