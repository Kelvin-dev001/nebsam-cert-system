require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// --- Import and mount your routes here ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/certificates', require('./routes/certificate'));
app.use("/api", require("./routes/masterData"));

// Example of a protected route
const auth = require('./middleware/authMiddleware');
app.get('/api/protected', auth, (req, res) => {
  res.json({ msg: `Hello ${req.user.id}, you are authenticated!`, role: req.user.role });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));