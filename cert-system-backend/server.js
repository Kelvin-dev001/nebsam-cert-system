require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const allowedOrigins = [
  'https://nebsam-cert-system.vercel.app',
  'https://nebsam-cert-system-6iy7kwz4y-kelvins-projects-1de5cca3.vercel.app', 
  'http://localhost:3000'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Helpful in dev/staging to see Mongoose queries (set MONGOOSE_DEBUG=true)
if (process.env.MONGOOSE_DEBUG === 'true') {
  mongoose.set('debug', true);
}

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('[server] MONGO_URI missing');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    const db = mongoose.connection;
    console.log('[server] MongoDB connected to DB:', db.name);
  })
  .catch((err) => {
    console.error('[server] Mongo connection error:', err);
    process.exit(1);
  });

// --- Import and mount your routes here ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/certificates', require('./routes/certificate'));
app.use('/api', require('./routes/masterData'));

// Health check
app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'dev' }));

// Example protected route
const auth = require('./middleware/authMiddleware');
app.get('/api/protected', auth, (req, res) => {
  res.json({ msg: `Hello ${req.user.id}, you are authenticated!`, role: req.user.role });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[server] Listening on ${PORT}`));