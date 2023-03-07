import { type FastifyInstance } from 'fastify';

/* ex.  
    /token/0x1234567890abcdef/1/  - get token URI of 1
    /token/0x1234567890abcdef/1/10/ - get 10 tokens URIs starting from 1 to 10
*/
export function updateUsersSchema(fastify: FastifyInstance) {
    return {
        schema: {
            description: 'Update users to class',
            tags: ['user'],
            params: {
                type: 'object',
                required: ['contract', 'id1', 'id2'],
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
            querystring: {
                classid: { type: 'number' }
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
/* ex.  
    /token/mint/0x1234567890abcdef/1?address=<someones_wallet_address>  - mint token of class 1 tp <someones_wallet_address>
*/
