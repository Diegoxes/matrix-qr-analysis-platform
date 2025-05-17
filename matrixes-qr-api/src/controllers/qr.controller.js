const { invocarLambda } = require('../services/lambda.service');
const axios=require('axios')
const logger=require('../utils/basic-logger')
require('dotenv').config();


const calcularQR = async (req, res) => {
  const { matrix } = req.body;

  if (!Array.isArray(matrix) || !Array.isArray(matrix[0])) {
    return res.status(400).json({ error: 'La matriz no es válida' });
  }

  try {
    const token = req.headers.authorization.split(' ')[1]; // "Bearer <token>"
    const resultadoQR = await invocarLambda({ matrix });
    const analysisResult = await sendBackendQRAnalysis(resultadoQR, token); 
    logger.info('Factorización QR realizada correctamente');
    res.json(analysisResult);
  } catch (error) {
    logger.error({ err: error }, 'Error al procesar la factorización QR');
    console.error('Error en Lambda:', error);
    res.status(500).json({ error: 'Error al procesar la factorización QR' });
  }
};

module.exports = { calcularQR };

const sendBackendQRAnalysis = async (resultadoQR, token) => {

   const { Q, R } = JSON.parse(resultadoQR.body); 
  const payload = { Q, R };

  const urlOtroBackend =  `${process.env.QR_ANALYSIS_URL}/api/analyze` || 'http://localhost:3005/api/analyze';
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  };

  try {
    const response = await axios.post(urlOtroBackend, payload, config);
    logger.info('Análisis QR enviado al backend externo correctamente');
    const data=response.data
    return {data,payload};
  } catch (error) {
    logger.error({ err: error }, 'Error en el backend externo');
    console.error("Error en el otro backend:", error.response.data || error.message);
    throw new Error(`Error en el backend externo: ${error.message}`); 
  }
};
