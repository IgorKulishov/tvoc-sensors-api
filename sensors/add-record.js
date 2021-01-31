'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

module.exports.create = (event, context, callback) => {
  // For testing purposes need to instantiate Table inside function with region defined
  let data;
  const timestamp = new Date().getTime();
  if(typeof event.body === 'string') {
    data = JSON.parse(event.body);
  } else {
    data = event.body;
  }

  if (!data.sensorRecords) {
    console.error('Validation Failed');
    callback({
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the order item.',
    }, null);
    return;
  }
  const sensorRecordsDetails = {
    TableName: process.env.DYNAMODB_TVOC_SENSOR_RECORDS,
    Item: {
      id: uuid.v1(),
      sensorRecords: typeof data.sensorRecords ==='string' ? JSON.parse(data.sensorRecords) : data.sensorRecords,
      createdAt: timestamp
    }
  };
  /** Safe placed orders **/
  dynamoDb.put(sensorRecordsDetails, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback({
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the order item.',
      }, null);
      return;
    }
    callback(null, sensorRecordsDetails.Item);
  });
};
