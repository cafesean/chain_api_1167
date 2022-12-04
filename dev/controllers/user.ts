import { FastifyInstance } from 'fastify';
import { ethers } from 'ethers';
import * as env from '../constants/constants';
import { abi } from '../constants/abi';


import {
  updateUsersSchema
} from '../schema/user';

export default async function userController(fastify: FastifyInstance) {
	fastify.get(
		'/user',
		async (request, reply) => {
			var response = await fastify.service.collection.hello();
			return { result: response };
		}
	)

  	fastify.get(
      '/:contract/:id1/:id2',
	  async (request : any, resp: any) => {
        //const { count } = request.query; 
		const { contract, id1, id2 } = request.params;

		try {
			const contractNFT = new ethers.Contract(contract, abi, env.wallet);
			const response = await fastify.service.user.getUsers(contractNFT, id1, id2);
		
	        return { result: response };
		} catch(err) {
			resp.send(err);
		}

      }
	)
  	fastify.get(
      '/:contract/:id',
	  async (request : any, resp: any) => {
        //const { count } = request.query; 
		const { contract, id } = request.params;
        const { skillid, atttributeId } = request.query;
		try {
			const contractNFT = new ethers.Contract(contract, abi, env.wallet);

            if (skillid) {
    			var response = await fastify.service.user.getUserSkills(contractNFT, id, skillid);
            } else if (atttributeId) {
                var response = await fastify.service.user.getUserAttributes(contractNFT, id, atttributeId);
            }

	        return { result: response };
		} catch(err) {
			resp.send(err);
		}

      }
	)
    //update users to class
    /* example: http://localhost:3000/user/0x5FbDB2315678afecb367f032d93F642f64180aa3/1/2?classid=1 */
  	fastify.post(
        '/:contract/:id1/:id2',
        updateUsersSchema(fastify),
        async (request : any, resp: any) => {
            const { contract, id1, id2 } = request.params;
            const { classid } = request.query;
            try {
                const contractNFT = new ethers.Contract(contract, abi, env.wallet);
                const response = await fastify.service.user.updateUsers(contractNFT, classid, id1, id2);
                
                return { result: response };
            } catch(err) {
                resp.send(err);
            }

        }
	)
}