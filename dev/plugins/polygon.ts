import fp from 'fastify-plugin';
import Polygon from '../polygon';

export default fp((fastify:any, _:any, done:any) => {
  const polygonClient = new Polygon(
    fastify.config.polygon.baseUrl,
    fastify.config.polygon.apiKey,
  );
  fastify.decorate('polygon', polygonClient);
  done();
}, {
  fastify: '4.x',
  name: 'fastify-polygon-client',
  dependencies: [
    // 'crowdserve-config',
  ]
});

declare module 'fastify' {
  interface FastifyInstance {
    polygon: Polygon;
  }
}
