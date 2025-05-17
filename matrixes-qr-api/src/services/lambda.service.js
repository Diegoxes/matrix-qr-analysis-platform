require('dotenv').config();

const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const lambda = new AWS.Lambda();

const invocarLambda = async (inputData) => {
  const params = {
    FunctionName: 'FactorizacionQR', 
    Payload: JSON.stringify({
      body: JSON.stringify(inputData),
    }),
  };

  const result = await lambda.invoke(params).promise();
  return JSON.parse(result.Payload);
};

module.exports = { invocarLambda };
