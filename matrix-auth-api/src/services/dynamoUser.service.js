require('dotenv').config();
const { DynamoDBClient,  ScanCommand , PutItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION
});

async function getUserByEmail(email) {
  const command = new ScanCommand({
    TableName: "InterseguroUsuarios",
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": { S: email },
    },
  });

  const response = await client.send(command);
  return response.Items && response.Items.length > 0 ? response.Items[0] : null;
}


async function createUser(idUsuario, nombre, hashedPassword,email) {
  const command = new PutItemCommand({
    TableName: "InterseguroUsuarios",
    Item: {
      idUsuario: { S: idUsuario },
      nombre: { S: nombre },
      password: { S: hashedPassword },
      email: { S: email },
    },
    ConditionExpression: "attribute_not_exists(idUsuario)" // evita sobrescribir
  });

  await client.send(command);
}

async function updateUserPasswordByEmail(email, hashedPassword) {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("Usuario no encontrado");

  const idUsuario = user.idUsuario.S;

  const command = new UpdateItemCommand({
    TableName: "InterseguroUsuarios",
    Key: {
      idUsuario: { S: idUsuario },
    },
    UpdateExpression: "SET password = :pwd",
    ExpressionAttributeValues: {
      ":pwd": { S: hashedPassword },
    },
  });

  await client.send(command);
}

module.exports = {
  getUserByEmail,
  createUser,
  updateUserPasswordByEmail,
};
