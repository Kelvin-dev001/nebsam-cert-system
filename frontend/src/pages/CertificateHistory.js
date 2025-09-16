import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Table, TableHead, TableBody, TableRow, TableCell, Paper, Stack } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CertificateHistory = () => {
  const [certs, setCerts] = useState([]);
  const [filters, setFilters] = useState({ type: "", customer: "", serial: "" });
  const navigate = useNavigate();

  const fetchData = async (filters = {}) => {
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.customer) params.customer = filters.customer;
    if (filters.serial) params.serial = filters.serial;
    const res = await axios.get("/api/certificates/search", { params });
    setCerts(res.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => { fetchData(filters); };

  return (
    <Box maxWidth={900} mx="auto" mt={5}>
      <Typography variant="h5" mb={2}>Certificate History</Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <TextField label="Type" name="type" value={filters.type} onChange={handleFilter} select SelectProps={{ native: true }}>
          <option value="">All</option>
          <option value="tracking">Tracking</option>
          <option value="radio">Radio</option>
        </TextField>
        <TextField label="Customer" name="customer" value={filters.customer} onChange={handleFilter} />
        <TextField label="Serial No" name="serial" value={filters.serial} onChange={handleFilter} />
        <Button variant="contained" onClick={handleSearch}>Search</Button>
      </Stack>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial No</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Issued To</TableCell>
              <TableCell>Date of Issue</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {certs.map(cert => (
              <TableRow key={cert._id}>
                <TableCell>{cert.certificateSerialNo}</TableCell>
                <TableCell>{cert.type}</TableCell>
                <TableCell>{cert.issuedTo}</TableCell>
                <TableCell>{cert.dateOfIssue?.slice(0,10)}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => navigate(`/certificates/${cert._id}/preview`)}>Preview</Button>
                  <Button size="small" onClick={() => navigate(`/certificates/${cert._id}/share`)}>Share</Button>
                </TableCell>
              </TableRow>
            ))}
            {certs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}><Typography>No certificates found.</Typography></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default CertificateHistory;