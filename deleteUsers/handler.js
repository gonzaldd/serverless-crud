const aws = require("aws-sdk");

let dbParams = {};

if (process.env.IS_OFFLINE) {
  dbParams = {
    region: "localhost",
    endpoint: "http://localhost:8001",
  };
}

const dynamoDB = new aws.DynamoDB.DocumentClient(dbParams);

const deleteUsers = async (event, context) => {
  let userId = event.pathParameters.id;

  const params = {
    Key: { pk: userId },
    TableName: "crud-serverless-table",
    ReturnValues: "ALL_OLD",
  };

  try {
    const userData = await dynamoDB.delete(params).promise();
    if (!userData?.Attributes) throw { status: 404, message: "Not found" };

    return {
      statusCode: 200,
      body: JSON.stringify({ result: "ok" }),
    };
  } catch (error) {
    console.log("error", error);
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({ message: error }),
    };
  }
};

module.exports = {
  deleteUsers,
};
