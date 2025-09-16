import React, { useContext } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <Box maxWidth={600} mx="auto" mt={8} p={3}>
      <Typography variant="h4" mb={2}>Welcome, {user?.name}!</Typography>
      <Stack spacing={2} direction="column">
        <Button variant="contained" onClick={() => navigate("/certificates/new-tracking")}>
          Issue Vehicle Tracking Certificate
        </Button>
        <Button variant="contained" onClick={() => navigate("/certificates/new-radio")}>
          Issue Radio Call Ownership Certificate
        </Button>
        <Button variant="outlined" onClick={() => navigate("/certificates/history")}>
          Certificate History
        </Button>
        <Button color="error" variant="text" onClick={logout}>Logout</Button>
      </Stack>
    </Box>
  );
};

export default Dashboard;