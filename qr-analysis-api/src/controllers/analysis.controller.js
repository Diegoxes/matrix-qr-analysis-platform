const logger = require('../utils/basic-logger'); 
const { getMatrixStats } = require('../utils/matrixUtils');

const analyzeMatrices = (req, res) => {
  try {
    const { Q, R } = req.body;

    if (!Q || !R) {
      logger.warn('Matrices Q o R faltantes en la solicitud');
      return res.status(400).json({ message: 'Matrices Q y R son requeridas.' });
    }
    const stats = getMatrixStats([Q, R]);
    logger.info({ stats }, 'Resultado del análisis de matrices');
    return res.json(stats);

  } catch (error) {
    logger.error({ error }, 'Error al procesar matrices');
    return res.status(500).json({ message: 'Error al procesar matrices.', error: error.message });
  }
};


module.exports = { analyzeMatrices };
