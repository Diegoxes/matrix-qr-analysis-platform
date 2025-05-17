const express = require('express');
const cors = require('cors');
const analysisRoutes = require('./src/routes/analysis.routes');



const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', analysisRoutes);


const PORT = process.env.PORT || 3005;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`));