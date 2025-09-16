const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// Static master data (replace with DB or config if needed)
const vehicleMakes = ["Toyota", "Nissan", "Isuzu", "Mitsubishi", "Mazda"];
const bodyTypes = ["Pickup", "Lorry", "Saloon", "SUV", "Mini Bus"];
const devices = ["DeviceA", "DeviceB", "DeviceC", "DeviceD"];

// Vehicle makes
router.get("/vehicle-makes", auth, (req, res) => {
  res.json(vehicleMakes);
});

// Body types
router.get("/body-types", auth, (req, res) => {
  res.json(bodyTypes);
});

// Devices
router.get("/devices", auth, (req, res) => {
  res.json(devices);
});

module.exports = router;