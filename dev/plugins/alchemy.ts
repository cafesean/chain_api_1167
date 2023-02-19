import fp from 'fastify-plugin';
import Alchemy from '../alchemy';
// import dotenv from 'dotenv';

export default fp((fastify:any, _:any, done:any) => {
  const alchemyClient = new Alchemy(
    // fastify.config.alchemy.apiKey,
    // fastify.config.alchemy.network,
    process.env.TESTNET_PRIVATE_KEY!,
    process.env.ALCHEMY_TESTNET_URL,
  );
  fastify.decorate('alchemy', alchemyClient);
  done();
}, {
  fastify: '4.x',
  name: 'fastify-alchemy-client',
  dependencies: [
    // 'crowdserve-config',
  ]
});

declare module 'fastify' {
  interface FastifyInstance {
    alchemy: Alchemy;
  }
}
