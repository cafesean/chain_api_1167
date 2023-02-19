import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import { pingSchema } from '../schema/app';

export default function appController(fastify: FastifyInstance, _: FastifyPluginOptions, done: (err?: Error) => void) {
  fastify.get(
    '/ping',
    pingSchema(fastify),
    (req, resp) => {
      resp.success({
        env: fastify.config.env,
        version: fastify.config.version,
        // debug: fastify.config.debug,
      });
    }
  );
  done();
}
