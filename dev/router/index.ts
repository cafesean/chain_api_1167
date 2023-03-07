import { FastifyInstance } from 'fastify';

// import appController from '../controller/app';
import tokenController from '../controllers/token';
import collectionController from '../controllers/collection';
import userController from '../controllers/user';
import contractController from '../controllers/contract';


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

  // fastify.register(appController);
  fastify.register(tokenController, { prefix : '/token' });
  fastify.register(collectionController, { prefix : '/collection' });
  fastify.register(userController, { prefix : '/user' });
  fastify.register(contractController, { prefix : '/contract' });
    
}