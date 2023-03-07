import { type FastifyInstance } from 'fastify';

/* ex.  
    /token/0x1234567890abcdef/1/  - get token URI of 1
    /token/0x1234567890abcdef/1/10/ - get 10 tokens URIs starting from 1 to 10
*/
export function getUriSchema(fastify: FastifyInstance) {
    return {
        schema: {
            description: 'Return the URI of token',
            tags: ['token'],
            params: {
                type: 'object',
                required: ['contract'],
                properties: {
                    contract: {
                        type: 'string',
                    },
                    id1: {
                        type: 'number',
                    },
                    id2: {
                        type: 'number',
                    }
                }
            },
            // querystring: {
            //     count: { type: 'number' }
            // },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        result: { type: 'string' }
                    }
                }
            }
        }
    }
}
/* ex.  
    /token/mint/0x1234567890abcdef/1?address=<someones_wallet_address>  - mint token of class 1 tp <someones_wallet_address>
*/
export function mintSchema(fastify: FastifyInstance) {
    return {
        schema: {
            description: 'Mint one token',
            tags: ['token'],
            params: {
                type: 'object',
                required: ['contract', 'classId'],
                properties: {
                    contract: {
                        type: 'string',
                    },
                    classId: {
                        type: 'number',
                    }
                }
            },
            querystring: {
                address: { type: 'string' }
                // skillIds: { type: 'number[]' },
                // skillScores: { type: 'number[]' },
                // attributeIds: { type: 'number[]' },
                // attributeValues: { type: 'string[]' }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        result: { type: 'string' }
                    }
                }
            }
        }
    }
}