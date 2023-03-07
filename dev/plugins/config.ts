import fp from 'fastify-plugin';
// import * as ms from '@lukeed/ms';

import Config from '../config';

function getStringEnv(path: string, defaultValue?: string): string {
  const value = process.env[path];
  if (value !== undefined) {
    return value;
  } else if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`environment variable ${path} not found`);
}

// function getIntEnv(path: string, defaultValue?: number): number {
//   try {
//     const s = getStringEnv(path);

//     const value = parseInt(s);
//     if (!isNaN(value)) {
//       return value;
//     }
//   } catch (err) {
//     if (defaultValue !== undefined) {
//       return defaultValue;
//     }
//   }
//   throw new Error(`environment variable ${path} not found`);
// }

// function getDateEnv(path: string, defaultValue?: number): number {
//   try {
//     const s = getStringEnv(path);

//     const value = ms.parse(s);
//     if (value) {
//       return value;
//     }
//   } catch (err) {
//     if (defaultValue !== undefined) {
//       return defaultValue;
//     }
//   }
//   throw new Error(`environment variable ${path} not found`);
// }

/**
 * @fastify/env Fastify plugin to check environment variables.
 *
 * @see https://github.com/fastify/fastify-env
 */
export default fp(async (fastify) => {
  const config: Config = {
    env: getStringEnv('NODE_ENV', 'development'),
    version: getStringEnv('VERSION', 'development'),
    timezone: getStringEnv('timezone', 'Asia/Singapore'),
    // debug: getIntEnv('debug', 0) === 1,
    apiKey: getStringEnv('TESTNET_PRIVATE_KEY'),
    baseUrl: getStringEnv('base_url'),
    database: {
      uri: getStringEnv('DATABASE_URL')
    },
    // redis: {
    //   host: getStringEnv('redis_host'),
    //   port: getIntEnv('redis_port'),
    //   password: getStringEnv('redis_password', '') || undefined,
    // },
    polygon: {
      baseUrl: getStringEnv('polygon_base_url'),
      apiKey: getStringEnv('polygon_api_key'),
    },
    alchemy: {
      apiKey: getStringEnv('alchemy_api_key'),
      network: getStringEnv('alchemy_network'),
    },
  }
  fastify.decorate('config', config);
}, {
  fastify: '4.x',
  name: 'chainxp-config'
});

declare module 'fastify' {
  interface FastifyInstance {
    config: Config
  }
}
