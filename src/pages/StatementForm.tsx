import React, { ComponentProps, useState } from "react";
import { Formik, Form } from "formik";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useDispatch } from 'react-redux';
import type {AppDispatch } from "../redux";
import {addStatement } from '../redux/statements';
import { useNavigate } from "react-router-dom";

type AppFieldProps = {
  label: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>)=> void;
  value: string;
  sx?: ComponentProps<typeof TextField>["sx"];
}

interface FormData {
  id: string;
  name: string;
  contactInformation: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
}

const initialForm = {
  id: '',
  name: '',
  contactInformation: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  },
}

const AppField: React.FC<AppFieldProps> = ({
  label,
  name,
  sx,
  onChange,
  value
}) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      name={name}
      label={label}
      sx={{ mt: 2 }}
      value={value}
      onChange={onChange}
    />
  );
};

export default function StatementForm() {
const dispatch = useDispatch<AppDispatch>();
const [formData, setFormData] = useState(initialForm);
const [inputRequiredError, setInputError] = useState<string>("");
const navigate = useNavigate();

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;
  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    setFormData((prevFormData) => {
      const updatedParent = {
          ...(prevFormData[parent as keyof FormData] as Record<string, any>),
          [child]: value,
      };
      return {
          ...prevFormData,
          [parent]: updatedParent,
      };
    });
  } else {
    setFormData({
      ...formData,
      [name]: value,
    });
  }
};
const handleSubmit = async () => {
  if(!formData.name) {
    setInputError("Please provide business name.");
  }else{
    try {
      await dispatch(addStatement(formData)).unwrap();
      setInputError("");
      setFormData(initialForm);
      navigate(`/statements`);
    } catch (error) {
      console.error(error);
    }
  }
}; 
    
const handleCancel = () => {
  navigate(`/statements`)
  setFormData(initialForm);
}

return (
  <Container sx={{ mt: 2 }}>
    <Paper sx={{ p: 5, mt: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Create Statement
      </Typography>

      <Formik
          initialValues={initialForm}
          onSubmit={handleSubmit}
      >
        <Form>
          <AppField label="Business Name" name="name" value={formData.name} onChange={handleChange}/>
          <AppField label="First Name" name="contactInformation.firstName" value={formData.contactInformation.firstName} onChange={handleChange}/>
          <AppField label="Last Name" name="contactInformation.lastName" value={formData.contactInformation.lastName} onChange={handleChange}/>
          <AppField label="Email" name="contactInformation.email" value={formData.contactInformation.email} onChange={handleChange}/>
          <AppField label="Phone Number" name="contactInformation.phoneNumber" value={formData.contactInformation.phoneNumber} onChange={handleChange}/>
          {inputRequiredError && <div style={{ color: 'red' }}>{inputRequiredError}</div>}
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" type="submit" sx={{ marginRight: '8px'}}>
              Submit Request
            </Button>
            <Button  variant="contained" type="reset" onClick={handleCancel}>Cancel</Button>
          </Box>
        </Form>
      </Formik>
    </Paper>
  </Container>
);
}
