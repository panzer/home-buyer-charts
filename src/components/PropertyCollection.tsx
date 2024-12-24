import React, { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";

import DeleteIcon from "@mui/icons-material/Delete";
import { ListSubheader } from "@mui/material";

const propertyTypes = [
  "Condo",
  "Apartment",
  "Single Family",
  "Multi-Family",
  "Townhouse",
];

interface Property {
  address: string;
  askingPrice: number;
  hoa: number;
  propertyType: string;
}

interface PropertyCollectionProps {
  onChange: (properties: Property[]) => void;
}

const PropertyCollection: React.FC<PropertyCollectionProps> = ({
  onChange,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [newProperty, setNewProperty] = useState<Property>({
    address: "",
    askingPrice: 0,
    hoa: 0,
    propertyType: propertyTypes[0],
  });

  function isValid(property: Property): boolean {
    return Boolean(
      property.address && property.askingPrice && property.propertyType
    );
  }

  const handleAddProperty = useCallback(() => {
    if (isValid(newProperty)) {
      const updatedProperties = [...properties, newProperty];
      setProperties(updatedProperties);
      onChange(updatedProperties);
      setNewProperty({
        address: "",
        askingPrice: 0,
        hoa: 0,
        propertyType: propertyTypes[0],
      });
    } else {
      // Handle the error state here, e.g., show an error message
    }
  }, [newProperty, properties, onChange]);

  const handleDeleteProperty = useCallback(
    (index: number) => {
      const updatedProperties = properties.filter((_, i) => i !== index);
      setProperties(updatedProperties);
      onChange(updatedProperties);
    },
    [properties, onChange]
  );

  function toCurrency(value: number): string {
    if (isNaN(value)) return "$0";
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  return (
    <Box sx={{ m: 2 }}>
      <FormControl fullWidth margin="normal" required size="small">
        <InputLabel htmlFor="property-address">Property Address</InputLabel>
        <OutlinedInput
          id="property-address"
          value={newProperty.address}
          onChange={(e) =>
            setNewProperty({ ...newProperty, address: e.target.value })
          }
          label="Property Address"
        />
      </FormControl>
      <FormControl fullWidth margin="normal" required size="small">
        <InputLabel htmlFor={"asking-price"}>Asking Price</InputLabel>
        <OutlinedInput
          id="asking-price"
          label="Asking Price"
          value={toCurrency(newProperty.askingPrice).slice(1)}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          onChange={(e) =>
            setNewProperty({
              ...newProperty,
              askingPrice: parseFloat(e.target.value.replace(/[^0-9.-]+/g, "")),
            })
          }
        />
      </FormControl>

      <FormControl fullWidth margin="normal" size="small">
        <InputLabel htmlFor="hoa-fee">HOA</InputLabel>
        <OutlinedInput
          id="hoa-fee"
          value={toCurrency(newProperty.hoa).slice(1)}
          onChange={(e) =>
            setNewProperty({
              ...newProperty,
              hoa: parseFloat(e.target.value.replace(/[^0-9.-]+/g, "")),
            })
          }
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label="HOA"
        />
      </FormControl>
      <TextField
        select
        label="Property Type"
        value={newProperty.propertyType}
        onChange={(e) =>
          setNewProperty({ ...newProperty, propertyType: e.target.value })
        }
        margin="normal"
        fullWidth
        required
        size="small"
      >
        {propertyTypes.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="contained"
        onClick={handleAddProperty}
        disabled={!isValid(newProperty)}
        sx={{ mt: 2 }}
      >
        Add Property
      </Button>
      <List
        sx={{ mt: 2 }}
        subheader={
          <ListSubheader disableGutters>Shown Properties</ListSubheader>
        }
      >
        {properties.map((property, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteProperty(index)}
              >
                <DeleteIcon />
              </IconButton>
            }
            sx={{
              border: 1,
              borderRadius: "4px",
              borderColor: "primary.main",
              mb: 1,
            }}
          >
            <ListItemText
              primary={property.address}
              secondary={`${toCurrency(
                property.askingPrice
              )}, HOA: ${toCurrency(property.hoa)}, Type: ${
                property.propertyType
              }`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PropertyCollection;
