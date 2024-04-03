import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { fetchStatements, selectStatements, selectLoading } from '../redux/statements';
import type { AppDispatch } from "../redux";
import { Link } from "react-router-dom";

export default function Statements() {
  const dispatch = useDispatch<AppDispatch>();
  const statements = useSelector(selectStatements);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    dispatch(fetchStatements());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
    <Button sx={{ margin: theme => theme.spacing(2) }} component={Link} variant="contained" to={`/statement-form`}>
      Create Statement
    </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Business Name</TableCell>
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
    </Container>
  );
}