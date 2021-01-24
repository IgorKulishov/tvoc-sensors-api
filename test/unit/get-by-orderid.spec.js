const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const getByOrderId = require('../../sensors/get-by-orderid');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

describe('test get order details by order id', () => {
    const eventMock = { pathParameters: { id: '1234567' } };
    let dynamoDb;
    let getTableSpy = sinon.spy();

    beforeEach(function() {
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('DynamoDB.DocumentClient', 'get', getTableSpy);

        AWS.config.update({ region: "us-east-1" });
        dynamoDb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
    });

    afterEach(function() {
        AWSMock.restore('DynamoDB');
    });

    it('if dynamoDB get by orderid was called', () => {
        getByOrderId.get(eventMock, {}, (arg1, arg2) => { return });
        expect(getTableSpy.calledOnce).to.be.true;
    });
});
