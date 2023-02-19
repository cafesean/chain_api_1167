import { PrismaClient } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime';
import fp from 'fastify-plugin';

export type FastifyPrismaClientOptions = Omit<
  PrismaClientOptions,
  '__internal'
>;

export default fp<FastifyPrismaClientOptions>(async (fastify, opts) => {
  if (fastify.prisma) {
    throw (new Error('fastify-prisma-client has been defined before'));
  }

  const prisma = new PrismaClient({
    rejectOnNotFound: opts.rejectOnNotFound,
    datasources: opts.datasources,
    errorFormat: opts.errorFormat,
    log: opts.log
  });

  await prisma.$connect();

  fastify
    .decorate('prisma', prisma)
    .decorateRequest('prisma', { getter: () => fastify.prisma })
    .addHook('onClose', async (fastify, done) => {
      await fastify.prisma.$disconnect();
      done();
    });
}, {
  fastify: '4.x',
  name: 'fastify-prisma-client',
  dependencies: [
    // 'crowdserve-config'
  ]
});

declare module 'fastify' {
  interface FastifyRequest {
    prisma: PrismaClient;
  }
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}