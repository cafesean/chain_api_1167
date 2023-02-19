import { FastifyInstance } from 'fastify'

export function pingSchema(fastify: FastifyInstance) {
  return {
    schema: {
      description: 'Get service status',
      tags: ['app'],
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            code: { type: 'number' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                env: { type: 'string' },
                version: { type: 'string' },
                // debug: { type: 'boolean' },
                minimal_app_version: {
                  type: 'object',
                  properties: {
                    ios: { type: 'string' },
                    android: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
}
