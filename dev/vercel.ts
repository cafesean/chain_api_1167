import * as dotenv from "dotenv";
dotenv.config();
const init = require('./api/app');

// Require the framework
import Fastify from "fastify";

// Instantiate Fastify with some config
const app = Fastify({
  logger: false,
});

// Register your application as a normal plugin.
app.register(init, {
    prefix: '/'
});

export default async (req: any, res: any) => {
    await app.ready();
    app.server.emit('request', req, res);
}