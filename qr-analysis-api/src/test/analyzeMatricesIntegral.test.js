const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const { analyzeMatrices } = require('../controllers/analysis.controller');
const app = express();
app.use(bodyParser.json());
app.post('/analyze', analyzeMatrices);

describe('Integración POST /analyze', () => {
  it('deberia responder con estadisticas correctas para matrices validas', async () => {
    const response = await request(app)
      .post('/analyze')
      .send({
        Q: [[1, 0], [0, 1]],
        R: [[2, 0], [0, 2]],
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('sum');
    expect(response.body).toHaveProperty('average');
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');
    expect(response.body).toHaveProperty('isDiagonal');
  });

  it('debería responder con error 400 si falta una matriz', async () => {
    const response = await request(app)
      .post('/analyze')
      .send({ Q: [[1, 2]] }); // Falta R

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Matrices Q y R son requeridas.');
  });

  it('deberia responder con error 500 si matriz invalida provoca fallo', async () => {
    const response = await request(app)
      .post('/analyze')
      .send({
        Q: [['a', 0], [0, 1]],
        R: [[2, 0], [0, 2]],
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error al procesar matrices.');
  });
});
