import fp from 'fastify-plugin';

import {
  type FastifyReply,
  type FastifyRequest,
} from 'fastify';

import * as errors from '../errors';

export default fp(
  (fastify:any, _:any, done:any) => {
    fastify.decorate(
      'authenticate',
      async (request: FastifyRequest, resp: FastifyReply) => {
        const apiKey = request.headers['x-api-key'];
        if (apiKey !== fastify.config.apiKey) {
          throw errors.create(errors.StatusCodes.BAD_REQUEST);
        }
      },
    );
    done();
  },
  {
    fastify: '4.x',
    name: 'fastify-jwt',
    // dependencies: ['crowdserve-config'],
  },
);
