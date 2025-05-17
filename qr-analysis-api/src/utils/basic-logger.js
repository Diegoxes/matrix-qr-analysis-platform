const bunyan = require('bunyan');
const fs = require('fs');
const path = require('path');


const logsPath = path.join(__dirname, '..', 'logs');

// Crea la carpeta logs si no existe 
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath, { recursive: true });
}

module.exports = bunyan.createLogger({
  name: 'qr-analysis-api',
  streams: [
    {
      type: 'rotating-file',
      path: path.join(logsPath, 'info.log'),
      period: '1d',
      level: 'info',
      count: 3,
    },
    {
      type: 'rotating-file',
      path: path.join(logsPath, 'error.log'),
      period: '1d',
      level: 'error',
      count: 7,
    },
    {
      type: 'rotating-file',
      path: path.join(logsPath, 'trace.log'),
      period: '1d',
      level: 'trace',
      count: 3,
    },
  ],
});
