import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { fetchStatements, selectStatements, selectLoading, addStatement } from '../redux/statements';
import type { AppDispatch } from "../redux";

interface FormData {
  name: string;
  contactInformation: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
}

export default function Statements() {
  const dispatch = useDispatch<AppDispatch>();
  const statements = useSelector(selectStatements);
  const loading = useSelector(selectLoading);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    contactInformation: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    dispatch(fetchStatements());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
    try {
      await dispatch(addStatement(formData)).unwrap();
      //await createStatement(formData);
      setOpen(false);
      // Reload or update the statements list
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
    <Button sx={{ margin: theme => theme.spacing(2) }} variant="contained" onClick={() => setOpen(true)}>
      Create Statement
    </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Statement</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {statements.map((statement) => (
            <TableRow key={statement.id}>
              <TableCell>{statement.name}</TableCell>
              <TableCell>{statement.contactInformation.firstName}</TableCell>
              <TableCell>{statement.contactInformation.lastName}</TableCell>
              <TableCell>{statement.contactInformation.email}</TableCell>
              <TableCell>{statement.contactInformation.phoneNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Statement</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Business Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            variant="outlined"
            label="First Name"
            name="contactInformation.firstName"
            value={formData.contactInformation.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Last Name"
            name="contactInformation.lastName"
            value={formData.contactInformation.lastName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            name="contactInformation.email"
            value={formData.contactInformation.email}
            onChange={handleChange}
            required
          />
           <TextField
            fullWidth
            variant="outlined"
            label="Phone Number"
            name="contactInformation.phoneNumber"
            value={formData.contactInformation.phoneNumber}
            onChange={handleChange}
            required
          />
          {/* Input fields for contact information... */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}