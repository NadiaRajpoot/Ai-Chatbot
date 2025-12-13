const serverless = require("serverless-http");
const app = require("../src/Server");

// For Vercel serverless - wrap and export
module.exports = serverless(app);
