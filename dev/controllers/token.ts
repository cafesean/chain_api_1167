import { FastifyInstance } from 'fastify';
import { ethers } from 'ethers';
// import * as dotenv from 'dotenv';
import * as env from '../constants/constants';
import { abi } from '../constants/abi';
// dotenv.config();


// console.log("provider = ", provider);

import {
  getUriSchema
} from '../schema/token';

export default async function tokenController(fastify: FastifyInstance) {
	fastify.get(
		'/',
		getUriSchema(fastify),
		async (request, reply) => {
			var helloString = await fastify.service.token.hello();
			return { result: helloString };
		}
	)

  	fastify.get(
      '/:contract/:id1/:id2',
      getUriSchema(fastify),
	  async (request : any, resp: any) => {
        //const { count } = request.query; 
		const { contract, id1, id2 } = request.params;

		try {
			const contractNFT = new ethers.Contract(contract, abi, env.wallet);
			const uriString = await fastify.service.token.getUris(contractNFT, id1, id2);
		
	        return { result: uriString };
		} catch(err) {
			resp.send(err);
		}

      }
	)


  	// fastify.post(
    //   '/mint/:contract/:classId',
    //   mintSchema(fastify),
	//   async (request : any, resp: any) => {
    //     //const { count } = request.query; 
	// 	const { contract, classId } = request.params;
	// 	// const { address, skillIds, skillScores, attributeIds, attributeValues } = request.query;
	// 	const { address } = request.query;



	// 	try {
	// 		const contractNFT = new ethers.Contract(contract, abi, env.wallet);
	// 		const mintResult = await fastify.service.token.mint(
	// 				contractNFT,
	// 				classId,
	// 				address);
	// 				// skillIds, 
	// 				// skillScores, 
	// 				// attributeIds, 
	// 				// attributeValues);
		
	//         return { result: mintResult };
	// 	} catch(err) {
	// 		resp.send(err);
	// 	}

    //   }
	// )

//   	fastify.get(
//       '/:contract/:id1',
//       getUriSchema(fastify),
// 	  async (request : any, resp: any) => {
//         // const { id } = request.query; 
// 		try {
// 			const contractNFT = new ethers.Contract(request.params.contract, env.NFT_ABI, wallet);
// 			const uriString = await fastify.service.token.getURI(contractNFT, request.params.id);
		
// 	        return { result: uriString };
// 		} catch(err) {
// 			resp.send(err);
// 		}

//       }
//   )
}