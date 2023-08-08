import { BaseService } from "./base";
import { ethers } from "hardhat";
import * as errors from "../errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Migrate these to params
const ProxySol = "TokenContract";
const DelegateSol = "DelegateContract";
// const TemplateSol =
// 	"./contracts/template/jetdevs/jetdevs-developer.sol:TemplateContract";
const TemplateSol = "contracts/Template.sol:TemplateContract";
const FactorySol = "ProxyFactory";

async function attachContract(signer: any, address: string, contract: string) {
	const contractFactory = await ethers.getContractFactory(contract);
	const attachedContract = contractFactory.connect(signer).attach(address);
	// const attachedContract = contractFactory.attach(address);

	console.log("Attached contract name: ", contract);
	console.log("Attached contract: ", attachedContract.address);
	console.log("Attached owner: ", await attachedContract.owner());

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

		console.log("Attaching contract: ", contract_address);
		const contractProxy = await attachContract(owner, contract_address, ProxySol);

		console.log("Attached");
		console.log("contractProxy contractURI: ", await contractProxy.contractURI());

		// const contractDelegate = new ethers.Contract(DelegateSol, abi, owner);
		// const proxyFactory = await ethers.getContractFactory("Proxy");

		let class_id = "0";

		console.log("request body: ", reqBody);

		try {
			// console.log("uri:", await contractProxy.uri(1));

			const response = await contractProxy._setClass(
				Number(class_id),
				reqBody.name,
				reqBody.desc,
				"",
				reqBody.template
			);
			const receipt = await response.wait();
			console.log("Receipt: ", receipt);
			for (const event of receipt.events) {
				if (event.eventSignature === "ClassCreated(string,uint256)") {
					const arg = event.args[1]; // uint256 value is 2nd arg in array as hex value
					class_id = arg.toString();
				}
			}
		} catch (e) {
			console.log(e);
			throw new Error("Error in _setClass");
		}
		// if (reqBody.template != "0x0000000000000000000000000000000000000000") {
		// 	await contractProxy.connect(owner).setTemplateContract(1, reqBody.template);
		// }

		const newXp = await prisma.series.update({
			where: {
				id: Number(reqBody.series_id),
			},
			data: {
				xp: {
					create: {
						// contract: contract_address,
						class_id,
						contract_address,
						title: reqBody.name,
						description: reqBody.desc,
						image_url: reqBody.image_url,
						slug: reqBody.slug,
					},
				},
			},
			include: {
				xp: {
					select: {
						id: true,
					},
				},
			},
		});

		return newXp.xp;
	}

	async cloneProxy(reqBody: any) {
		const {
			uuid,
			factory_address,
			contract_address,
			delegate_address,
			org_id,
			name,
			baseUri,
			description,
			requirements,
			slug,
			image_url,
			template_id,
		} = reqBody;
		const utils = ethers.utils;
		const salt = utils.formatBytes32String(uuid);
		const [owner] = await ethers.getSigners();

		const contractFactory = await attachContract(owner, factory_address, FactorySol);

		// salt MUST be unique for eip-1167 cloning to work
		const response = await contractFactory.cloneProxy(contract_address, salt);

		let addressClone;
		const receipt = await response.wait(); // response is empty if using hardhat network
		// console.log("response=", await receipt.events);
		for (const event of receipt.events) {
			if (event.event === "ProxyCloned") {
				addressClone = event.args.cloneAddress;
			}
		}

		// initialize clone
		const cloneContract = await attachContract(owner, addressClone, ProxySol);
		const initResponse = await cloneContract.initialize(name, baseUri);

		console.log("initResponse: ", initResponse);

		// grant access to delegate
		// const delegateContract = await attachContract(owner, delegate_address, DelegateSol);
		// const delegateResponse = await delegateContract.grantAccess(addressClone, "OPS_ROLE");

		// console.log("delegateResponse: ", delegateResponse);

		// const prisma = new PrismaClient();

		let contractData;
		try {
			contractData = await prisma.contract.create({
				data: {
					name: name,
					type: "clone",
					contract_address: addressClone,
					owner_address: owner.address,
				},
			});
		} catch (error) {
			console.log("contractData Error: ", error);
		}

		let seriesData;
		try {
			seriesData = await prisma.series.create({
				data: {
					org_id: org_id,
					contract_address: addressClone,
					delegate_address: delegate_address,
					owner: owner.address,
					title: name,
					description: description,
					requirements: requirements,
					image_url: image_url,
					slug: slug,
					template_id: template_id as number,
				},
				select: {
					id: true, // Include the new series id in the returned data
				},
			});
		} catch (error) {
			console.log("seriesData Error: ", error);
		}
		// return new id of series created

		console.log("seriesData: ", seriesData);
		return addressClone;
	}

	async deploySingle(signer: any, sol: string, contractName: string) {
		console.log("******* in deploySingle: %s", sol);

		const factory = await ethers.getContractFactory(sol);
		const contract = await factory
			.connect(signer)
			.deploy()
			.then((contract) => contract.deployed());

		// console.log("	contract owner: ", await contract.owner());
		console.log("	 New contract address: ", contract.address);
		// console.log("	Signer: ", signer.address);

		// const prisma = new PrismaClient();

		let contractData;

		try {
			contractData = await prisma.contract.create({
				data: {
					name: sol,
					contract_address: contract.address,
					owner_address: signer.address,
				},
			});
		} catch (error) {
			console.log("contractData Error: ", error);
		}
		return contract;
	}

	async deployFactory(reqBody: any) {
		var contractFactory;
		var addressFactory;

		const { proxy_address } = reqBody;

		const [deployer] = await ethers.getSigners();
		console.log("Deployer: ", deployer.address);
		try {
			contractFactory = await this.deploySingle(deployer, FactorySol, "-");

			console.log("	contractFactory owner: ", await contractFactory.owner());
			console.log("	ProxyFactory address: ", contractFactory.address);
			addressFactory = contractFactory.address;
			await contractFactory.initialize();

			// attach proxy
			const contractProxy = await attachContract(deployer, proxy_address, ProxySol);

			//register factory
			await contractProxy.registerFactory(contractFactory.address);
		} catch (error) {
			console.log("Deploy Error: ", error);
			return error;
		}

		return { addressFactory };
	}

	async deployAll(reqBody: any) {
		var addressTemplate, addressDelegate;
		var contractDelegate, contractProxy, contractTemplate;
		var addressProxy, addressTemplate, addressDelegate;
		// var contractData;

		const [deployer] = await ethers.getSigners();
		console.log("Deployer: ", deployer.address);
		try {
			contractDelegate = await this.deploySingle(deployer, DelegateSol, "-"); // #1 Delegate
			addressDelegate = contractDelegate.address;
			contractProxy = await this.deploySingle(deployer, ProxySol, reqBody.name); // #2 Proxy
			await contractProxy.initialize("", "");

			// ?await contractProxy.;
			addressProxy = contractProxy.address;
			console.log("Proxy and Delegate contracts deployed");
			contractTemplate = await this.deploySingle(deployer, TemplateSol, "-"); // #3 Template
			addressTemplate = contractTemplate.address;
		} catch (error) {
			console.log("Deploy Error: ", error);
			return error;
		}

		try {
			await contractProxy.connect(deployer).setDelegateAddress(addressDelegate);
			const setDefaultTemplate = await contractProxy.setDefaultTemplate(addressTemplate);

			console.log("setDefaultTemplate - chainId: ", setDefaultTemplate.chainId);

			await contractProxy.grantAccess(addressTemplate, "ADMIN_ROLE");
			await contractProxy.connect(deployer).setTemplateContract(1, addressTemplate);
			console.log("Config done");
		} catch (error) {
			console.log("Config Error: ", error);
			return error;
		}

		return { addressProxy };
	}

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

	async setClassMetadata(contract_address: string, class_id: string, metadata_url: string) {
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

	async mintNFT(contract_address: string, class_id: string, user_address: string) {
		// await this.findContractClass(contract_address, class_id);

		const [deployer] = await ethers.getSigners();
		const contractProxy = await attachContract(deployer, contract_address, ProxySol);

		// const factory = await ethers.getContractFactory(ProxySol);
		// const factoryContract = factory.attach(contract_address);

		let response;
		try {
			response = await contractProxy.mint(Number(class_id), user_address);
		} catch (e) {
			console.log(e);
			throw e;
		}
		let token_id;

		const receipt = await response.wait();
		console.log("Receipt: ", receipt);
		for (const event of receipt.events) {
			if (event.eventSignature === "TokenCreated(address,uint256)") {
				const arg = event.args[1]; // uint256 value is 2nd arg in array as hex value
				token_id = arg.toString();
			}
		}

		console.log("token_id = ", token_id);

		// const prisma = new PrismaClient();

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

	async transferNFT(contract_address: string, class_id: string, from: string, to: string, amount: number) {
		await this.findContractClass(contract_address, class_id);

		const [deployer] = await ethers.getSigners();
		const factory = await ethers.getContractFactory(ProxySol);
		const factoryContract = factory.connect(deployer).attach(contract_address);

		const response = await factoryContract.safeTransferFrom(from, to, class_id, amount, 6);
		console.log(`transfer NFT from '${from}' to '${to}' Txn: ${response.hash}`);
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

	async burnNFT(contract_address: string, class_id: string, userAddress: string, amount: number) {
		await this.findContractClass(contract_address, class_id);

		const [deployer] = await ethers.getSigners();
		const factory = await ethers.getContractFactory(ProxySol);
		const factoryContract = factory.connect(deployer).attach(contract_address);

		const response = await factoryContract.burn(userAddress, class_id, amount);
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
