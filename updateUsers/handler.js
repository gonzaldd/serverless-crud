const aws = require("aws-sdk");

let dbParams = {};

if (process.env.IS_OFFLINE) {
  dbParams = {
    region: "localhost",
    endpoint: "http://localhost:8001",
  };
}

const dynamoDB = new aws.DynamoDB.DocumentClient(dbParams);

const updateUsers = async (event, context) => {
  let userId = event.pathParameters.id;
  const body = JSON.parse(event.body);

  const params = {
    TableName: "crud-serverless-table",
    Key: { pk: userId },
    UpdateExpression: "set #name = :name, #phone = :phone",
    ExpressionAttributeNames: { "#name": "name", "#phone": "phone" },
    ExpressionAttributeValues: { ":name": body.name, ":phone": body.phone },
    ReturnValues: "ALL_NEW",
  };

  try {
    const userData = await dynamoDB.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ user: userData?.Attributes }),
    };
  } catch (error) {
    console.log("error", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};

module.exports = {
  updateUsers,
};
