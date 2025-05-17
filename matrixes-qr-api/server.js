const express = require('express');
const cors = require('cors');
const qrRoutes = require('./src/routes/qr.routes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', qrRoutes);

const PORT = process.env.PORT || 3006;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`));