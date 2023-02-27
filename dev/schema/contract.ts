import { FastifyInstance } from "fastify";

export function deployContractSchema(fastify: FastifyInstance) {
	return {
		// preHandler: [fastify.authenticate],
		schema: {
			description: "Deploy specific contract",
			tags: ["blockchain", "contract"],
			body: {
				type: "object",
				required: ["name"],
				properties: {
					name: {
						type: "string",
						maxLength: 250,
					},
				},
			},
			response: {
				200: {
					description: "Successful response",
					type: "object",
					properties: {
						code: { type: "number" },
						message: { type: "string" },
						data: {
							type: "object",
							properties: {
								contract_id: { type: "string" },
							},
						},
					},
				},
			},
		},
	};
}

export function registerContractEventSchema(fastify: FastifyInstance) {
	return {
		// preHandler: [fastify.authenticate],
		schema: {
			description: "Register event on contract",
			tags: ["blockchain", "contract"],
			params: {
				type: "object",
				required: ["contract_id", "class_id"],
				properties: {
					contract_id: {
						type: "string",
					},
					class_id: {
						type: "string",
					},
				},
			},
			body: {
				type: "object",
				required: ["organizerId", "eventId", "ticketId", "ticketTypeId"],
				properties: {
					organizerId: { type: "string" },
					eventId: { type: "string" },
					ticketId: { type: "string" },
					ticketTypeId: { type: "string" },
				},
			},
			response: {
				200: {
					description: "Successful response",
					type: "object",
					properties: {
						code: { type: "number" },
						message: { type: "string" },
					},
				},
			},
		},
	};
}

export function queryContractSchema(fastify: FastifyInstance) {
	return {
		// preHandler: [fastify.authenticate],
		schema: {
			description: "Query contract by event information",
			tags: ["blockchain", "contract"],
			query: {
				type: "object",
				required: ["organizerId", "eventId", "ticketId", "ticketTypeId"],
				properties: {
					organizerId: {
						type: "string",
					},
					eventId: {
						type: "string",
					},
					ticketId: {
						type: "string",
					},
					ticketTypeId: {
						type: "string",
					},
				},
			},
			response: {
				200: {
					description: "Successful response",
					type: "object",
					properties: {
						code: { type: "number" },
						message: { type: "string" },
						data: {
							type: "object",
							properties: {
								contract_id: {
									type: "string",
								},
								class_id: {
									type: "string",
								},
							},
						},
					},
				},
			},
		},
	};
}

export function addContractAdminSchema(fastify: FastifyInstance) {
	return {
		// preHandler: [fastify.authenticate],
		schema: {
			description: "Add admin user for contract",
			tags: ["blockchain", "contract"],
			params: {
				type: "object",
				required: ["contract_id"],
				properties: {
					contract_id: {
						type: "string",
					},
				},
			},
			body: {
				type: "object",
				required: ["user_address"],
				properties: {
					user_address: {
						type: "string",
						minLength: 42,
						maxLength: 42,
					},
				},
			},
			response: {
				200: {
					description: "Successful response",
					type: "object",
					properties: {
						code: { type: "number" },
						message: { type: "string" },
						data: {
							type: "object",
							properties: {
								user_id: { type: "string" },
							},
						},
					},
				},
			},
		},
	};
}

export function addContractClassSchema(fastify: FastifyInstance) {
	return {
		// preHandler: [fastify.authenticate],
		schema: {
			description: "Add class for contract",
			tags: ["blockchain", "contract"],
			params: {
				type: "object",
				required: ["contract_id"],
				properties: {
					contract_id: {
						type: "string",
					},
				},
			},
			body: {
				type: "object",
				required: ["name", "desc"],
				properties: {
					name: {
						type: "string",
						maxLength: 250,
					},
					desc: {
						type: "string",
						maxLength: 250,
					},
					series_id: {
						type: "string",
						maxLength: 10,
					},
					image_url: {
						type: "string",
						maxLength: 250,
					},
					slug: {
						type: "string",
						maxLength: 50,
					},
				},
			},
			response: {
				200: {
					description: "Successful response",
					type: "object",
					properties: {
						code: { type: "number" },
						message: { type: "string" },
						data: {
							type: "object",
							properties: {
								class_id: { type: "string" },
							},
						},
					},
				},
			},
		},
	};
}

export function setContractClassSchema(fastify: FastifyInstance) {
	return {
		// preHandler: [fastify.authenticate],
		schema: {
			description: "Update metadata_url for contract class",
			tags: ["blockchain", "contract"],
			params: {
				type: "object",
				required: ["contract_id", "class_id"],
				properties: {
					contract_id: {
						type: "string",
					},
					class_id: {
						type: "string",
					},
				},
			},
			body: {
				type: "object",
				required: ["metadata_url"],
				properties: {
					metadata_url: {
						type: "string",
						maxLength: 250,
					},
				},
			},
			response: {
				200: {
					description: "Successful response",
					type: "object",
					properties: {
						code: { type: "number" },
						message: { type: "string" },
						data: {
							type: "object",
							properties: {
								txnHash: { type: "string" },
							},
						},
					},
				},
			},
		},
	};
}

export function mintContractNFTSchema(fastify: FastifyInstance) {
	return {
		// preHandler: [fastify.authenticate],
		schema: {
			description: "Mint nft to user",
			tags: ["blockchain", "contract", "mint"],
			params: {
				type: "object",
				required: ["contract_id", "class_id"],
				properties: {
					contract_id: {
						type: "string",
					},
					class_id: {
						type: "string",
					},
				},
			},
			query: {
				type: "object",
				required: ["address"],
				properties: {
					address: {
						type: "string",
						minLength: 42,
						maxLength: 42,
					},
				},
			},
			
		},
	};
}

export function transferContractNFTSchema(fastify: FastifyInstance) {
	return {
		// preHandler: [fastify.authenticate],
		schema: {
			description: "Transfer NFT to user",
			tags: ["blockchain", "contract", "transfer"],
			params: {
				type: "object",
				required: ["contract_id", "class_id"],
				properties: {
					contract_id: {
						type: "string",
					},
					class_id: {
						type: "string",
					},
				},
			},
			body: {
				type: "object",
				required: ["from", "to", "amount"],
				properties: {
					from: {
						type: "string",
						minLength: 42,
						maxLength: 42,
					},
					to: {
						type: "string",
						minLength: 42,
						maxLength: 42,
					},
					amount: {
						type: "number",
						maximum: 1000,
					},
				},
			},
			response: {
				200: {
					description: "Successful response",
					type: "object",
					properties: {
						code: { type: "number" },
						message: { type: "string" },
						data: {
							type: "object",
							properties: {
								txnHash: { type: "string" },
							},
						},
					},
				},
			},
		},
	};
}

export function burnContractNFTSchema(fastify: FastifyInstance) {
	return {
		// preHandler: [fastify.authenticate],
		schema: {
			description: "Burn specific NFT",
			tags: ["blockchain", "contract", "burn"],
			params: {
				type: "object",
				required: ["contract_id", "class_id"],
				properties: {
					contract_id: {
						type: "string",
					},
					class_id: {
						type: "string",
					},
				},
			},
			body: {
				type: "object",
				required: ["user_address", "amount"],
				properties: {
					user_address: {
						type: "string",
						minLength: 42,
						maxLength: 42,
					},
					amount: {
						type: "number",
						maximum: 1000,
					},
				},
			},
			response: {
				200: {
					description: "Successful response",
					type: "object",
					properties: {
						code: { type: "number" },
						message: { type: "string" },
						data: {
							type: "object",
							properties: {
								txnHash: { type: "string" },
							},
						},
					},
				},
			},
		},
	};
}

export function speedupTransactionSchema(fastify: FastifyInstance) {
	return {
		// preHandler: [fastify.authenticate],
		schema: {
			description: "Speedup Contract Transaction",
			tags: ["blockchain", "contract"],
			response: {
				200: {
					description: "Successful response",
					type: "object",
					properties: {
						code: { type: "number" },
						message: { type: "string" },
					},
				},
			},
		},
	};
}

export function confirmTransactionSchema(fastify: FastifyInstance) {
	return {
		// preHandler: [fastify.authenticate],
		schema: {
			description: "Confirm NFT transaction",
			tags: ["blockchain", "contract"],
			params: {
				type: "object",
				required: ["txnHash"],
				properties: {
					txnHash: {
						type: "string",
					},
				},
			},
			response: {
				200: {
					description: "Successful response",
					type: "object",
					properties: {
						code: { type: "number" },
						message: { type: "string" },
					},
				},
			},
		},
	};
}

export function verifyTransactionSchema(fastify: FastifyInstance) {
	return {
		// preHandler: [fastify.authenticate],
		schema: {
			description: "Verify NFT transaction",
			tags: ["blockchain", "contract"],
			params: {
				type: "object",
				required: ["txnHash"],
				properties: {
					txnHash: {
						type: "string",
					},
				},
			},
			response: {
				200: {
					description: "Successful response",
					type: "object",
					properties: {
						code: { type: "number" },
						message: { type: "string" },
						data: {
							type: "object",
							properties: {
								status: { type: "number" },
							},
						},
					},
				},
			},
		},
	};
}
