import { FastifyInstance } from 'fastify';
import { ethers } from 'ethers';
import * as env from '../constants/constants';
import { abi } from '../constants/abi';


// import {
//   getUriSchema
// } from '../schema/token';

export default async function collectionController(fastify: FastifyInstance) {
	fastify.get(
		'/:contract',
		async (request : any, resp: any) => {
            const { contract } = request.params;
            try {
                const response = await fastify.service.collection.getCollectionDetail(contract);
                return { result: response };
            } catch(err) {
                resp.send(err);
            } 
		}
	)

  	fastify.get(
        '/attribute/:contract/:id1/:id2',
        async (request : any, resp: any) => {
            const { contract, id1, id2 } = request.params;

            try {
                const contractNFT = new ethers.Contract(contract, abi, env.wallet);
                const response = await fastify.service.collection.getAttributes(contractNFT, id1, id2);
                return { result: response };
            } catch(err) {
                resp.send(err);
            }

        }
	)
  	fastify.get(
        '/skill/:contract/:id1/:id2',
        async (request : any, resp: any) => {
            const { contract, id1, id2 } = request.params;

            try {
                const contractNFT = new ethers.Contract(contract, abi, env.wallet);
                const response = await fastify.service.collection.getSkills(contractNFT, id1, id2);
                return { result: response };
            } catch(err) {
                resp.send(err);
            }
        }
	)
  	fastify.get(
        '/user/:contract/:id1/:id2',
        async (request : any, resp: any) => {
            const { contract, id1, id2 } = request.params;

            try {
                const contractNFT = new ethers.Contract(contract, abi, env.wallet);
                const response = await fastify.service.collection.getUsers(contractNFT, id1, id2);
                return { result: response };
            } catch(err) {
                resp.send(err);
            }
        }
	)
  	fastify.get(
        '/class/:contract/:id1/:id2',
        async (request : any, resp: any) => {
            const { contract, id1, id2 } = request.params;

            try {
                // const contractNFT = new ethers.Contract(contract, abi, env.wallet);
                // const response = await fastify.service.collection.getClasses(contractNFT, id1, id2);
                const response = await fastify.service.collection.getClasses(contract, id1, id2);
                return { result: response };
            } catch(err) {
                resp.send(err);
            }
        }
	)


  	fastify.post(
        '/:contract',
        async (request : any, resp: any) => {
            const { contract } = request.params;
            const { updateName } = request.query;
            try {
                const contractNFT = new ethers.Contract(contract, abi, env.wallet);
                const response = await fastify.service.collection.setName(contractNFT, updateName);
                
                return { result: response };
            } catch(err) {
                resp.send(err);
            }

        }
	)

	fastify.post(
		"/:contract_id/class",
		async (request: any, resp: any) => {
			const { contract_id } = request.params;
			// const { name, desc, image_url, slug } = request.body;
console.log("In addClass route")
			const contractClass = await fastify.service.collection.addClass(
				contract_id,
				request.body
			);

			resp.success({
				class_id: contractClass,
			});
		}
	);
}