import React, { ComponentProps, useState } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form, useField } from "formik";
import { Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";

import { selectClaimedListingById, updateClaimedListingReason } from "../redux/listings";
import { useAppSelector } from "../lib/useAppSelector";
import { Submission } from "../lib/applicationTypes";
import { useDispatch } from "react-redux";

type AppFieldProps = {
  label: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)=> void;

  // This line allows you to pass any styling options to the MaterialUI text
  // field that are allowed by TextField.
  sx?: ComponentProps<typeof TextField>["sx"];
}

// AppField is mostly a simple wrapper around MaterialUI's TextField, but
// hooks into Formik. Just saves us allot of typing.
const AppField: React.FC<AppFieldProps> = ({
  label,
  name,
  sx,
  onChange
}) => {
  const [field] = useField(name);
  const value = field.value || "";

  return (
    <TextField
      fullWidth
      variant="outlined"
      id={name}
      label={label}
      sx={sx}
      {...field}
      onChange={(event) => {
        field.onChange(event);
        if (onChange) {
          onChange(event);
        }
      }}
    />
  );
};

export default function Listing() {
  const { id = null } = useParams();
  const listing = useAppSelector((state) => selectClaimedListingById(state, id))
  const [inputRequiredError, setInputError] = useState<string>("");
  const dispatch = useDispatch();

  if (!listing) {
    return (
      <Box>Listing was not found!</Box>
    );
  }

  const initialValues: Submission = {
    listing,
  };

  const handleSubmit = () => {
    if(!listing.reason){console.log("yes")
      setInputError("Please provide reason for extention.");
    } else {console.log("no")
      setInputError("");
    }
  }

  const handleReasonChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const tempReason = event.target.value;
    if (id && tempReason !== listing?.reason) {
      dispatch(updateClaimedListingReason({ id, reason:tempReason }));
    }
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Paper sx={{ p: 5, mt: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Request An Extension For {listing.name}
        </Typography>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          <Form>
            <AppField label="Name" name="listing.name" />

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">
                Mailing Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <AppField
                    label="Address 1"
                    name="listing.mailingAddress.address1"/>
                </Grid>
                <Grid item xs={3}>
                  <AppField
                    label="Address 2"
                    name="listing.mailingAddress.address2"
                  />
                </Grid>
                <Grid item xs={2}>
                  <AppField
                    label="City"
                    name="listing.mailingAddress.city"
                  />
                </Grid>
                <Grid item xs={2}>
                  <AppField
                    label="State"
                    name="listing.mailingAddress.state"
                  />
                </Grid>
                <Grid item xs={2}>
                  <AppField
                    label="Zip"
                    name="listing.mailingAddress.zip"
                  />
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">
                Physical Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <AppField
                    label="Address 1"
                    name="listing.physicalAddress.address1"
                  />
                </Grid>
                <Grid item xs={3}>
                  <AppField
                    label="Address 2"
                    name="listing.physicalAddress.address2"
                  />
                </Grid>
                <Grid item xs={2}>
                  <AppField
                    label="City"
                    name="listing.physicalAddress.city"
                  />
                </Grid>
                <Grid item xs={2}>
                  <AppField
                    label="State"
                    name="listing.physicalAddress.state"
                  />
                </Grid>
                <Grid item xs={2}>
                  <AppField
                    label="Zip"
                    name="listing.physicalAddress.zip"
                  />
                </Grid>
              </Grid>
            </Box>

            <AppField sx={{ mt: 3 }} label="Reason for Extension" name="listing.reason" onChange={handleReasonChange}/>
            {inputRequiredError !=null && setInputError.length > 0 && <div style={{ color: 'red' }}>{inputRequiredError}</div>}

            <Box sx={{ mt: 3 }}>
              <Button variant="contained" type="submit">
                Submit Request
              </Button>
            </Box>
          </Form>
        </Formik>
      </Paper>
    </Container>
  );
}
