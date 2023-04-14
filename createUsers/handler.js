const aws = require("aws-sdk");
const { randomUUID } = require("crypto");

let dbParams = {};

if (process.env.IS_OFFLINE) {
  dbParams = {
    region: "localhost",
    endpoint: "http://localhost:8001",
  };
}

const dynamoDB = new aws.DynamoDB.DocumentClient(dbParams);

const createUsers = async (event, context) => {
  let id = randomUUID();
  let userBody = JSON.parse(event.body);

  userBody.pk = id;

  const params = {
    TableName: "crud-serverless-table",
    Item: userBody,
  };

  try {
    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ user: params.Item }),
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
  createUsers,
};
