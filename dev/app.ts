/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import { join } from 'path';
import Fastify from 'fastify';
import AutoLoad from '@fastify/autoload';

import router from './router';
import dotenv from "dotenv";

dotenv.config();


const fastifyOptions = {
  logger: true,
};

function init() {

	const app = Fastify(fastifyOptions);

	void app
	// Register plugins.
	.register(AutoLoad, {
		dir: join(__dirname, './plugins'),
	})
	.register(router);

	return app;
}


if (require.main === module) {
  // called directly i.e. "node app"

  var port = 4000
  init().listen({ port: port }, (err) => {
    if (err) console.error(err);
    console.log('server listening on ' + port);
  });
} else {
  // required as a module => executed on aws lambda
  module.exports = init;
}
