const express = require('express');
const cors = require('cors');

const userRoutes=require('./src/routes/user.routes')
const loginRoutes=require('./src/routes/login.routes')


const app = express();
app.use(cors());
app.use(express.json());

app.use('/user',userRoutes);
app.use('/security',loginRoutes);

const PORT = process.env.PORT || 3007;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`));