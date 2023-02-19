import { PrismaClient } from '@prisma/client';
import { FastifyBaseLogger } from 'fastify';
// import Redis from 'ioredis';

import Polygon from '../polygon';
import Alchemy from '../alchemy';

import Config from '../config';

export class BaseService {
  config!: Config;
  log!: FastifyBaseLogger;
  prisma!: PrismaClient;
  // redis!: Redis;
  polygon!: Polygon;
  alchemy!: Alchemy;
}
