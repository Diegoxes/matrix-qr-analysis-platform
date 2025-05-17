const logger = require('./basic-logger'); 


// Verifica si es una matriz válida de números
const isValidMatrix = (matrix) => {
  if (!Array.isArray(matrix)) return false;
  return matrix.every(row =>
    Array.isArray(row) &&
    row.every(val => typeof val === 'number' && !isNaN(val))
  );
};

// Aplano una matriz 2D
const flattenMatrix = (matrix) => matrix.flat();

// Verifico si una matriz es diagonal
const isDiagonal = (matrix) => {
  try {
    if (!isValidMatrix(matrix)) throw new Error('Matriz inválida en isDiagonal');

    const rows = matrix.length;
    const cols = matrix[0].length;
    if (rows !== cols) return false;

    return matrix.every((row, i) =>
      row.every((val, j) => (i === j ? true : val === 0))
    );
  } catch (error) {
    logger.error({ error, matrix }, 'Error en isDiagonal');
    return false;
  }
};

// Calculo estadisticas de todas las matrices
const getMatrixStats = (matrices) => {
  try {
    if (!Array.isArray(matrices) || matrices.length === 0) {
      throw new Error('El parámetro matrices debe ser un array no vacío');
    }

    matrices.forEach((matrix, idx) => {
      if (!isValidMatrix(matrix)) {
        throw new Error(`La matriz en posición ${idx} no es válida`);
      }
    });

    const allValues = matrices.flatMap(flattenMatrix);

    const sum = allValues.reduce((a, b) => a + b, 0);
    const average = sum / allValues.length;
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const hasDiagonal = matrices.some(isDiagonal);

    return {
      max,
      min,
      average,
      sum,
      isDiagonal: hasDiagonal,
    };
  } catch (error) {
    logger.error({ error, matrices }, 'Error en getMatrixStats');
    throw new Error('Ocurrió un error al calcular las estadísticas de la matriz.');
  }
};

module.exports = { getMatrixStats, isDiagonal };
