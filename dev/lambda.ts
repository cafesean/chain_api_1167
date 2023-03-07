const awsLambdaFastify = require('@fastify/aws-lambda')
const init = require('./api/app');

const proxy = awsLambdaFastify(init())
// or
// const proxy = awsLambdaFastify(init(), { binaryMimeTypes: ['application/octet-stream'] })

// exports.handler = proxy;
// or
// exports.handler = (event, context, callback) => proxy(event, context, callback);
// or
// exports.handler = (event, context) => proxy(event, context);
// or
exports.handler = async (event: any, context: any) => proxy(event, context);
