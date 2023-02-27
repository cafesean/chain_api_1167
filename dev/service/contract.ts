import { BaseService } from "./base";
import { ethers } from "hardhat";
import * as errors from "../errors";
import { PrismaClient } from "@prisma/client";

// Migrate these to params
const ProxySol = "ProxyContract";
const DelegateSol = "DelegateContract";
const TemplateSol =
	"./contracts/template/jetdevs/jetdevs-developer.sol:TemplateContract";

async function attachContract(address: string, contract: string) {
	const contractFactory = await ethers.getContractFactory(contract);
	const attachedContract = contractFactory.attach(address);

	return attachedContract;
}

// async function getAbi(address: string) {
// 	const prisma = new PrismaClient();
// 	try {
// 		console.log("Contract: ", address);
// 		const data = await prisma.series.findFirst({
// 			where: {
// 				contract_address: address,
// 			},
// 			select: {
// 				delegate_abi: true,
// 			},
// 		});

// 		// console.log("getAbidata: ", data);

// 		if (!data) {
// 			return null;
// 		}
// 		return data.delegate_abi;
// 	} catch (error) {
// 		throw error;
// 	}
// }

export class ContractService extends BaseService {
	async addClass(contract_address: string, reqBody: any) {
		console.log("contract_address: ", contract_address);

		// const abiData = await getAbi(contract_address).catch((error) => {
		// 	console.log("Error in getAbi: ", error);
		// 	throw new Error("Error in getAbi");
		// });

		// const abi = JSON.stringify(abiData);
		// console.log("abi: ", abi);
		// console.log("contract_abi: ", JSON.stringify(abiData?.contract_abi));
		const [owner] = await ethers.getSigners();
		// const contractDelegate = await attachContract(contract_address, DelegateSol);
		const contractProxy = await attachContract(contract_address, ProxySol);

		// const contractDelegate = new ethers.Contract(DelegateSol, abi, owner);
		// const proxyFactory = await ethers.getContractFactory("Proxy");

		console.log("contract_address: ", contract_address);
		let class_id = "0";

		console.log("request body: ", reqBody);
		try {
			const response = await contractProxy._setClass(
				Number(class_id),
				reqBody.name,
				reqBody.desc,
				"",
				reqBody.template
			);
			const receipt = await response.wait();

			for (const event of receipt.events) {
				if (event.eventSignature === "ClassCreated(uint256)") {
					 const arg = Number(event.args[0]);
					 class_id = arg.toString();
				}
			}
		} catch (e: any) {
			throw new Error("Error in adding class: ", e);
		}
		if (reqBody.template != "0x0000000000000000000000000000000000000000") {
			await contractProxy
				.connect(owner)
				.setTemplateContract(1, reqBody.template);
		}

		const prisma = new PrismaClient();

		const newXp = await prisma.series.update({
			where: {
				id: Number(reqBody.series_id),
			},
			data: {
				xp: {
					create: {
						// contract: contract_address,
						class_id,
						title: reqBody.name,
						description: reqBody.desc,
						image_url: reqBody.image_url,
						slug: reqBody.slug,
					},
				},
			},
		});

		return newXp.id;
	}

	async deploySingle(signer: any, sol: string, contractName: string) {
		const factory = await ethers.getContractFactory(sol);
		const contract = await factory.deploy(contractName);
		await contract.deployed();

		console.log("Deployed contract: ", sol, " ", contract.address);
		console.log("Signer: ", signer.address);

		return contract;
	}

	async deployAll(reqBody: any) {
		var addressTemplate, addressDelegate;
		var contractDelegate, contractProxy, contractTemplate;
		var addressProxy, addressTemplate, addressDelegate;
		var contractData;

		const [deployer] = await ethers.getSigners();

		try {
			contractDelegate = await this.deploySingle(deployer, DelegateSol, "-"); // #1 Delegate
			addressDelegate = contractDelegate.address;
			contractProxy = await this.deploySingle(
				deployer,
				ProxySol,
				reqBody.name
			); // #2 Proxy
			addressProxy = contractProxy.address;
			contractTemplate = await this.deploySingle(deployer, TemplateSol, "-"); // #3 Template
			addressTemplate = contractTemplate.address;

			console.log("Proxy and Delegate contracts deployed");
		} catch (error) {
			console.log("Deploy Error: ", error);
			return error;
		}

		try {
			await contractProxy
				.connect(deployer)
				.setDelegateAddress(addressDelegate);
			await contractProxy.setDefaultTemplate(addressTemplate);
			await contractProxy.grantAccess(addressTemplate, "ADMIN_ROLE");
			await contractProxy
				.connect(deployer)
				.setTemplateContract(1, addressTemplate);
			console.log("Config done");
		} catch (error) {
			console.log("Config Error: ", error);
			return error;
		}

		const prisma = new PrismaClient();

		try {
			contractData = await prisma.org.update({
				where: {
					id: reqBody.org_id,
				},
				data: {
					series: {
						create: {
							contract: addressProxy,
							contract_address: addressProxy,
							delegate_address: addressDelegate,
							template_address: addressTemplate,
							owner: deployer.address,
							title: reqBody.name,
							description: reqBody.description,
							requirements: reqBody.requirements,
							image_url: reqBody.image_url,
							slug: reqBody.slug,
						},
					},
				},
			});
		} catch (error) {
			console.log("contractData Error: ", error);
			return error;
		}
		return { contractData };
	}

	// async deploy(reqBody: any) {
	// 	const [deployer] = await ethers.getSigners();
	// 	console.log("Deploying contracts with the account:", deployer.address);
	// 	console.log("Account balance:", (await deployer.getBalance()).toString());

	// 	// Deploy Proxy
	// 	const factoryProxy = await ethers.getContractFactory(ProxySol);
	// 	const deployProxy = await factoryProxy.deploy(reqBody.name);

	// 	// Deploy Delegate
	// 	console.log("factoryContract = ", deployProxy.address);

	// 	// Deploy Proxy
	// 	const factory = await ethers.getContractFactory(ProxySol);
	// 	const factoryContract = await factory.deploy(reqBody.name);

	// 	const prisma = new PrismaClient();

	// 	await factoryContract
	// 		.deployed()
	// 		.then(async () => {
	// 			console.log("In then");
	// 			try {
	// 				const contract = await prisma.org.update({
	// 					where: {
	// 						id: reqBody.org_id,
	// 					},
	// 					data: {
	// 						series: {
	// 							create: {
	// 								contract: factoryContract.address,
	// 								contract_address: factoryContract.address,
	// 								owner: deployer.address,
	// 								title: reqBody.name,
	// 								description: reqBody.description,
	// 								requirements: reqBody.requirements,
	// 								image_url: reqBody.image_url,
	// 								slug: reqBody.slug,
	// 							},
	// 						},
	// 					},
	// 				});
	// 				return contract;
	// 			} catch (err) {
	// 				console.log("Error = ", err);
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			return err;
	// 		});

	// console.log(`Contract deployed to ${factoryContract.address}`);

	// console.log("value = ", await factoryContract.value());

	// if (!contract) {
	// return contract;
	// }

	async register(
		contract_address: string,
		class_id: string,
		organizerId: string,
		eventId: string,
		ticketId: string,
		ticketTypeId: string
	) {
		await this.findContract(contract_address);

		// await this.prisma.xp.create({
		//   data: {
		//     contract_address,
		//     class_id,
		//     organizerId,
		//     eventId,
		//     ticketId,
		//     ticketTypeId,
		//   }
		// });
	}

	async query(
		organizerId: string,
		eventId: string,
		ticketId: string,
		ticketTypeId: string
	) {
		// const event = await this.prisma.contractEvents.findFirst({
		//   where:  {
		//     organizerId,
		//     eventId,
		//     ticketId,
		//     ticketTypeId,
		//   }
		// });
		// if (!event) {
		//   throw errors.create(errors.StatusCodes.NOT_FOUND);
		// }
		// return event;
	}

	async addAdminUser(contract_address: string, userAddress: string) {
		const contract = await this.findContract(contract_address);

		const factory = await ethers.getContractFactory(ProxySol);
		const factoryContract = factory.attach(contract!);
		const role = "ADMIN_ROLE";

		const response = await factoryContract.grantUserRole(userAddress, role);
		console.log(`Txn: ${response.hash}`);

		// const contractUser = await this.prisma.contractUser.create({
		//   data: {
		//     contract_address: contract_address,
		//     userId: userAddress,
		//     role: role,
		//   }
		// });
		// await response.wait();

		// return contractUser;
	}

	async setClassMetadata(
		contract_address: string,
		class_id: string,
		metadata_url: string
	) {
		await this.findContractClass(contract_address, class_id);

		const factory = await ethers.getContractFactory(ProxySol);
		const factoryContract = factory.attach(contract_address);

		const response = await factoryContract.setURI(class_id, metadata_url);
		console.log(`Txn: ${response.hash}`);
		console.log("NFT setURI: ", metadata_url);

		const contract_classes = await this.prisma.contract_classes.update({
			where: {
				contract_id_class_id: {
					contract_id: contract_address,
					class_id: class_id,
				},
			},
			data: {
				metadata_url,
			},
		});
		await response.wait();
		return contract_classes;
	}

	async mintNFT(
		contract_address: string,
		class_id: string,
		user_address: string
	) {
		// await this.findContractClass(contract_address, class_id);

		const [deployer] = await ethers.getSigners();
		const factory = await ethers.getContractFactory(ProxySol);
		const factoryContract = factory
			.connect(deployer)
			.attach(contract_address);

		const response = await factoryContract.mint(
			class_id,
			user_address,
			[],
			[],
			[],
			[]
		);

		var token_id;
		const receipt = await response.wait(); // response is empty if using hardhat network
		console.log("response=", await receipt.events);
		for (const event of receipt.events) {
			if (event.event === "TransferSingle") {
				token_id = Number(event.args.id);
			}
		}

		// console.log("token_id = ", token_id);

		const prisma = new PrismaClient();

		const txn = [
			{
				txn_hash: response.hash, // must be unique
				contract_address, // required
				class_id, // must be string
				token_id: token_id + "", // must be string
				from: deployer.address, // required
				to: user_address, // required
				status: -1,
			},
		];

		for (const t of txn) {
			const transaction = await prisma.transaction.create({
				data: t,
			});
			console.log(`Created transaction with hash: ${transaction.txn_hash}`);
		}

		// const allowlist = await prisma.allowlist.updateMany({
		// 	data: {
		// 		// txn_hash: response.hash,
		// 		token_id,
		// 		is_owned: true,
		// 	},
		// 	where: {
		// 		contract_address,
		// 		class_id,
		// 		user_address,
		// 	},
		// });

		// console.log("before await");
		// await response.wait();
		// console.log("transaction: ", transaction);

		return txn;
	}

	async transferNFT(
		contract_address: string,
		class_id: string,
		from: string,
		to: string,
		amount: number
	) {
		await this.findContractClass(contract_address, class_id);

		const [deployer] = await ethers.getSigners();
		const factory = await ethers.getContractFactory(ProxySol);
		const factoryContract = factory
			.connect(deployer)
			.attach(contract_address);

		const response = await factoryContract.safeTransferFrom(
			from,
			to,
			class_id,
			amount,
			6
		);
		console.log(
			`transfer NFT from '${from}' to '${to}' Txn: ${response.hash}`
		);
		// await response.wait(2);

		// note: add token_id
		const transaction = await this.prisma.transaction.create({
			data: {
				txn_hash: response.hash,
				contract_address: contract_address,
				class_id: class_id,
				from: from,
				to: to,
				status: -1,
			},
		});
		// await response.wait();
		return transaction;
	}

	async burnNFT(
		contract_address: string,
		class_id: string,
		userAddress: string,
		amount: number
	) {
		await this.findContractClass(contract_address, class_id);

		const [deployer] = await ethers.getSigners();
		const factory = await ethers.getContractFactory(ProxySol);
		const factoryContract = factory
			.connect(deployer)
			.attach(contract_address);

		const response = await factoryContract.burn(
			userAddress,
			class_id,
			amount
		);
		console.log(`burn NFT from '${userAddress}' Txn: ${response.hash}`);

		// note: add token_id
		const transaction = await this.prisma.transaction.create({
			data: {
				txn_hash: response.hash,
				contract_address: contract_address,
				class_id: class_id,
				from: deployer.address,
				to: userAddress,
				status: -1,
			},
		});
		await response.wait();
		return transaction;
	}

	async verify(txn_hash: string): Promise<number> {
		const transaction = await this.prisma.transaction.findUnique({
			where: {
				txn_hash,
			},
		});

		if (!transaction) {
			throw errors.create(errors.StatusCodes.NOT_FOUND);
		}

		const status = await this.polygon.scanTransaction(transaction.txn_hash);

		await this.prisma.transaction.update({
			where: {
				txn_hash,
			},
			data: {
				status,
			},
		});

		return status;
	}

	async findContract(contract_address: string) {
		const data = await this.prisma.series.findFirst({
			where: {
				contract: {
					equals: contract_address,
				},
			},
		});
		if (!data) {
			throw errors.create(errors.StatusCodes.NOT_FOUND);
		}
		return data.contract;
	}

	async findContractClass(contract_address: string, class_id: string) {
		const contract_classes = await this.prisma.contract_classes.findFirst({
			where: {
				contract_id: contract_address,
				class_id: class_id,
			},
			include: {
				contract: true,
			},
		});
		if (!contract_classes) {
			throw errors.create(errors.StatusCodes.NOT_FOUND);
		}
		return contract_classes;
	}
}
