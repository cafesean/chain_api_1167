/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

// import { join } from 'path';
import Fastify from 'fastify';
// import AutoLoad from '@fastify/autoload';

// import router from './src/router';

import { ethers } from 'ethers';
import dotenv from "dotenv";
import { abi } from './constants/abi';

dotenv.config();

const ALCHEMY_TESTNET_URL = process.env.ALCHEMY_TESTNET_URL;
const TESTNET_PRIVATE_KEY = process.env.TESTNET_PRIVATE_KEY;
// const PROXY_CONTRACT = process.env.PROXY_CONTRACT;
const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_TESTNET_URL);
const wallet = new ethers.Wallet(<string>TESTNET_PRIVATE_KEY, provider);


const fastifyOptions = {
  logger: true,
};

import {
  getUriSchema,
//   mintSchema,
} from './schema/token';

function init() {

  	const app = Fastify(fastifyOptions);

	app.get('/hello', (request: any, reply: any) => reply.send({ result: "hello" }));

	app.get('/mint', async (request: any, reply: any)  => {
     	reply.send({ result: "mint-api v1" });
    });


	app.post('/mint/:contract/:classId', 
		async (request: any, reply: any) => {
			const { contract, classId } = request.params;
			const { address } = request.query;
	// console.log("In mint");
	// console.log("contract: " + contract);
	// console.log("classId: " + classId);
	// console.log("address: " + address);
	// console.log("Wallet: " + wallet.address);

			try {
				const contractNFT = new ethers.Contract(contract, abi, wallet);
				let newTokenId = await contractNFT.connect(wallet).mint(classId, address, [], [], [],[]);

				reply.send({ result: "minted: " + newTokenId });

			} catch(err) {
				reply.send(err);
			}
		});


	app.get('/token', async (request: any, reply: any)  => {
		//  const { contract} = request.params;


		// done();
	// });
		reply.send({ result: "token-api v1" });
	});

	app.get(
		'/token/:contract/:id1/:id2',
		getUriSchema(app),
		async (request: any, reply: any) => {
			//const { count } = request.query; 
			const { contract, id1, id2 } = request.params;

			try {
				const contractNFT = new ethers.Contract(contract, abi, wallet);

				var i;
				// var data = {};
				var uriString;
				
				for (i = id1; i <= id2; i++) {
					
					uriString = uriString + await contractNFT.uri(i) + ", ";

					// data["uri" + i] = await contractNFT.uri(i);;
				}
				
				// const uriString = await fastify.service.token.getURIs(contractNFT, id1, id2);
				reply.send({ result: uriString });

			} catch(err) {
				reply.send(err);
			}

		}
	)
  	return app;
}

if (require.main === module) {
  // called directly i.e. "node app"
  init().listen({ port: 3000 }, (err) => {
    if (err) console.error(err);
    console.log('server listening on 3000');
  });
} else {
  // required as a module => executed on aws lambda
  module.exports = init;
}
