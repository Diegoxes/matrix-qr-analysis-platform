const { calcularQR } = require('../controllers/qr.controller');
const { invocarLambda } = require('../services/lambda.service');
const axios = require('axios');

jest.mock('../services/lambda.service');
jest.mock('axios');

describe('calcularQR', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { matrix: [[1, 2], [3, 4]] },
      headers: { authorization: 'Bearer token123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('debe devolver error 400 si la matriz no es válida', async () => {
    req.body.matrix = 'no es matriz';
    await calcularQR(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'La matriz no es válida' });
  });

  test('debe procesar correctamente y devolver resultado', async () => {
    // Mock de invocarLambda para devolver resultado simulado
    invocarLambda.mockResolvedValue({
      body: JSON.stringify({ Q: [[1, 0], [0, 1]], R: [[2, 3], [0, 4]] })
    });

    // Mock de axios.post para simular llamada al otro backend
    axios.post.mockResolvedValue({
      data: { analysis: 'ok' }
    });

    await calcularQR(req, res);

    expect(invocarLambda).toHaveBeenCalledWith({ matrix: req.body.matrix });
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3005/api/analyze',
      { Q: [[1, 0], [0, 1]], R: [[2, 3], [0, 4]] },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token123'
        })
      })
    );

    expect(res.json).toHaveBeenCalledWith({
      data: { analysis: 'ok' },
      payload: { Q: [[1, 0], [0, 1]], R: [[2, 3], [0, 4]] }
    });
  });

  test('debe devolver error 500 si falla invocarLambda o axios', async () => {
    invocarLambda.mockRejectedValue(new Error('Lambda failed'));

    await calcularQR(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al procesar la factorización QR' });
  });
});