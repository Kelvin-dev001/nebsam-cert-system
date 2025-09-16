import React, { useContext } from "react";
import { AppBar as MUIAppBar, Toolbar, Typography, Button } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AppBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <MUIAppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
          Nebsam Digital Solutions
        </Typography>
        {user && (
          <>
            <Button color="inherit" onClick={() => navigate("/dashboard")}>Dashboard</Button>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </MUIAppBar>
  );
};

export default AppBar;