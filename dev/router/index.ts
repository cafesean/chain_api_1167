import { FastifyInstance } from 'fastify';

import tokenController from '../controllers/token';


export default async function router(fastify: FastifyInstance) {

    fastify.setErrorHandler((error, request, resp) => {
        const payload: any = {
        url: request.url,
        headers: request.headers,
        body: request.body,
    };

    request.log.error(payload, error.message);
    resp.send(error.message);
  });

  fastify.register(tokenController, { prefix : '/token' });
    
}