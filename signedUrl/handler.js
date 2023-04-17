const AWS = require("aws-sdk");

const s3 = new AWS.S3({ signatureVersion: "v4" });

const signedS3URL = async (event, context) => {
  try {
    const filename = event.queryStringParameters.filename;
    const signedUrl = await s3.getSignedUrlPromise("putObject", {
      Key: `upload/${filename}`,
      Bucket: process.env.BUCKET,
      Expires: 300,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ signedUrl }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error on upload." }),
    };
  }
};

module.exports = {
  signedS3URL,
};
