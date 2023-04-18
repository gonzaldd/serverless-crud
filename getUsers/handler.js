const aws = require("aws-sdk");

let dbParams = {};

if (process.env.IS_OFFLINE) {
  dbParams = {
    region: "localhost",
    endpoint: "http://localhost:8001",
  };
}

const dynamoDB = new aws.DynamoDB.DocumentClient(dbParams);

const getUsers = async (event, context) => {
  let userId = event.pathParameters.id;

  const params = {
    ExpressionAttributeValues: { ":pk": userId },
    KeyConditionExpression: "pk = :pk",
    TableName: "usersTable",
  };

  try {
    const userData = await dynamoDB.query(params).promise();
    console.log("userData", userData);

    return {
      statusCode: 200,
      body: JSON.stringify({ user: userData?.Items, count: userData?.Count }),
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
  getUsers,
};
