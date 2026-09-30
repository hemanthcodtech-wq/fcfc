const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
  ],
  credentials: true,
}));
app.use(express.json());

app.use('/api/general', require('./routes/general'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/general/web3', require('./routes/web3'));

app.get('/', (req, res) => res.json({ message: '🚀 FCFC API is running' }));

process.on('unhandledRejection', (reason) => {
  console.warn('⚠️ Handled Rejection:', reason?.message || reason);
});

process.on('uncaughtException', (err) => {
  console.warn('⚠️ Handled Uncaught Exception:', err.message);
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
