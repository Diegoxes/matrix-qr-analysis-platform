// analyzeMatrices.test.js
const { analyzeMatrices } = require('../controllers/analysis.controller');
const logger = require('../utils/basic-logger');
const matrixUtils = require('../utils/matrixUtils');

jest.mock('../utils/basic-logger'); // Mockeamos logger
jest.mock('../utils/matrixUtils'); // Mockeamos getMatrixStats

describe('analyzeMatrices', () => {
  let req;
  let res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(), // Para poder encadenar .json()
      json: jest.fn(),
    };

    // Limpiamos mocks antes de cada test
    jest.clearAllMocks();
  });

  it('debería retornar 400 si faltan matrices Q o R', () => {
    req.body = { Q: [[1, 2]] }; // Falta R

    analyzeMatrices(req, res);

    expect(logger.warn).toHaveBeenCalledWith('Matrices Q o R faltantes en la solicitud');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Matrices Q y R son requeridas.' });
  });

  it('deberia retornar estadisticas si Q y R están presentes', () => {
    req.body = { Q: [[1]], R: [[2]] };
    const mockStats = { sum: 10, average: 5, min: 1, max: 9, isDiagonal: true };
    matrixUtils.getMatrixStats.mockReturnValue(mockStats);

    analyzeMatrices(req, res);

    expect(matrixUtils.getMatrixStats).toHaveBeenCalledWith([req.body.Q, req.body.R]);
    expect(logger.info).toHaveBeenCalledWith({ stats: mockStats }, 'Resultado del analisis de matrices');
    expect(res.json).toHaveBeenCalledWith(mockStats);
  });

  it('deberiaa retornar 500 si ocurre un error en el procesamiento', () => {
    req.body = { Q: [[1]], R: [[2]] };
    const errorMessage = 'Error inesperado';
    matrixUtils.getMatrixStats.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    analyzeMatrices(req, res);

    expect(logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error al procesar matrices.',
      error: errorMessage,
    });
  });
});
