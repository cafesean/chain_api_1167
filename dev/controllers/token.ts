import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import * as env from "../constants/constants";
import { getUriSchema, mintSchema } from "../schema/token";

export const getAbi = async (contract: string) => {
	const prisma = new PrismaClient();
	const data = await prisma.series.findFirst({
		where: {
			contract: contract,
		},
		select: {
			contract_abi: true,
		},
	});

	if (!data) {
		return null;
	}
	return data.contract_abi;
};

export default async function tokenController(fastify: FastifyInstance) {
	fastify.get("/", async (request, reply) => {
		var helloString = await fastify.service.token.hello();
		return { result: helloString };
	});

	// fastify.addContentTypeParser("application/json", (_req, body, done) => {
	// 	done(null, body);
	// });

	fastify.get(
		"/:contract/:id1/:id2",
		getUriSchema(fastify),
		async (request: any, resp: any) => {
			//const { count } = request.query;
			const { contract, id1, id2 } = request.params;
			// const { abi } = request.body;

			const abi = await getAbi(contract);

			if (!abi) {
				return { error: "ABI not found" };
			}

			try {
				const contractNFT = new ethers.Contract(contract, JSON.stringify(abi), env.wallet);
				const uriString = await fastify.service.token.getUris(
					contractNFT,
					id1,
					id2
				);

				return { result: uriString };
			} catch (err) {
				resp.send(err);
			}
		}
	);

	fastify.put(
		"/mint/:contract/:classId",
		mintSchema(fastify),
		async (request: any, resp: any) => {
			const { contract, classId } = request.params;
			// const { address, skillIds, skillScores, attributeIds, attributeValues } = request.query;
			const { address } = request.query;
			// const { abi } = request.body;

			const prisma = new PrismaClient();

			const abi = await prisma.series.findFirst({
				where: {
					contract: contract,
				},
				select: {
					abi: true,
				},
			});

			// console.log("DB abi = ", abi2);
			try {
				const contractNFT = new ethers.Contract(
					contract,
					JSON.stringify(abi?.abi),
					env.wallet
				);
console.log("contractNFT address = ", contractNFT.address)
console.log("abi = ", abi?.abi);


				// console.log("Abi = ", abi);
				const mintResult = await fastify.service.token.mint(
					contractNFT,
					classId,
					address
				);
				// skillIds,
				// skillScores,
				// attributeIds,
				// attributeValues);

				return { result: mintResult };
			} catch (err) {
				resp.send(err);
			}
		}
	);

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
