const serverless = require('serverless-http');
const app = require("../src/Server");



module.exports = serverless(app);
