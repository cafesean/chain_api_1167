import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { TokenService, CollectionService, UserService, ContractService } from '../service';

export default fp(async (fastify, opts) => {
  fastify
    .decorate('service', new ServiceHolder(fastify))
}, {
  fastify: '4.x',
  name: 'member-nft-service'
});

declare module 'fastify' {
  interface FastifyInstance {
    service: ServiceHolder
  }
}

class ServiceHolder {
  token: TokenService;
  collection: CollectionService;
  user: UserService;
  contract: ContractService;

  constructor(fastify: FastifyInstance) {
    this.token = ServiceHolder.init(fastify, TokenService);
    this.collection = ServiceHolder.init(fastify, CollectionService);
    this.user = ServiceHolder.init(fastify, UserService);
    this.contract = ServiceHolder.init(fastify, ContractService);
  }

  static init<T>(fastify: FastifyInstance, serviceType: { new(): T; }): T {
    const svc = new serviceType();
    // svc.config = fastify.config;
    // svc.log = fastify.log;
    // svc.prisma = fastify.prisma;
    // svc.redis = fastify.redis;
    // svc.mailgun = fastify.mailgun;
    // svc.web3 = fastify.web3;
    return svc;
  }
}