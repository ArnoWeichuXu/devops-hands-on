'use strict';

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
AWS.config.update({region: 'ap-southeast-2'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

// Hello World Lambda Function
'use strict';
console.log('Loading hello world function');

exports.handler = async (event) => {
    let name = "you";
    let city = 'World';
    let time = 'day';
    let day = '';
    let responseCode = 200;

    /*
    const TZConfig={timezone: 'Australia/Brisbane'};
    const hours = new Date().toLocaleString('en-AU', TZConfig);
    const day = new Date().toLocaleString('en-AU', {weekday: 'long'}, TZConfig);
    let id = AWS.util.uuid.v4();
    if (hours < 12) {
        time = 'morning';
    } else if (hours < 18) {
        time = 'afternoon';
    } else {
        time = 'evening';
    }
    */

    console.log("request: " + JSON.stringify(event));

    /*
    if (event.queryStringParameters && event.queryStringParameters.name) {
        console.log("Received name: " + event.queryStringParameters.name);
        name = event.queryStringParameters.name;
    }

    if (event.queryStringParameters && event.queryStringParameters.city) {
        console.log("Received city: " + event.queryStringParameters.city);
        city = event.queryStringParameters.city;
    }

    if (event.headers && event.headers['day']) {
        console.log("Received day: " + event.headers.day);
        day = event.headers.day;
    }
    */

    if (event.body) {
        let body = JSON.parse(event.body)

        if (body.name)
            name = body.name;
        else {
            response.statusCode = 400
            response.body = "Missing Name"
            return response
        }

        if (body.city)
            city = body.city;
        else {
            response.statusCode = 400
            response.body = "Missing City"
           return response
        }
            

        if (body.day)
            day = body.day;
        else
            day = new Date().toLocaleString('en-AU', {weekday: 'long'}, TZConfig); 

        if (body.time)
            time = body.time;
        else {
            time = new Date().toLocaleString('en-AU', TZConfig);

            if (time < 12) {
                time = 'morning';
            } else if (hours < 18) {
                time = 'afternoon';
            } else {
                time = 'evening';
            }
        }
    }
    else {
        response.statusCode = 400
        response.body = "Missing Body"
        return response
    }

    let greeting = `Good ${time}, ${name} of ${city}.`;
    if (day) greeting += ` Happy ${day}!`;

    let responseBody = {
        message: greeting,
        input: event
    };

    // The output from a Lambda proxy integration must be
    // in the following JSON object. The 'headers' property
    // is for custom response headers in addition to standard
    // ones. The 'body' property  must be a JSON string. For
    // base64-encoded payload, you must also set the 'isBase64Encoded'
    // property to 'true'.
    let response = {
        statusCode: responseCode,
        headers: {
            "x-custom-header" : "my custom header value"
        },
        body: JSON.stringify(responseBody)
    };
    console.log("response: " + JSON.stringify(response))
    return response;
};

//aws apigateway update-resource --rest-api-id orp868rdf8 --resource-id wdn7f6 --patch-operations op=replace,path=/pathPart,value=register
