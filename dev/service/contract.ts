import { BaseService } from "./base";
import { ethers } from "hardhat";
import * as errors from "../errors";

const contractSol = "Proxy";

export class ContractService extends BaseService {
	async deploy(name: string) {
		const [deployer] = await ethers.getSigners();
		console.log("Deploying contracts with the account:", deployer.address);
		console.log("Account balance:", (await deployer.getBalance()).toString());

		const factory = await ethers.getContractFactory(contractSol);
		const factoryContract = await factory.deploy(name);

		console.log("factoryContract = ", factoryContract.address);
		console.log("deployer = ", deployer.address);

		await factoryContract.deployed().then(() => {
      const contract = this.prisma.contract.create({
        data: {
          contract_id: factoryContract.address,
          owner: deployer.address,
          name: name,
        }
      });
      return contract;
    }).catch((err) => {
      return (err);
    });
    
		// console.log(`Contract deployed to ${factoryContract.address}`);

		// console.log("value = ", await factoryContract.value());

    // if (!contract) {
		// return contract;
	}

	async register(
		contract_id: string,
		class_id: string,
		organizerId: string,
		eventId: string,
		ticketId: string,
		ticketTypeId: string
	) {
		await this.findContract(contract_id);

		// await this.prisma.xp.create({
		//   data: {
		//     contract_id,
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
		//   where: {
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

	async addAdminUser(contract_id: string, userAddress: string) {
		const contract = await this.findContract(contract_id);

		const factory = await ethers.getContractFactory(contractSol);
		const factoryContract = factory.attach(contract.contract_id);
		const role = "ADMIN_ROLE";

		const response = await factoryContract.grantUserRole(userAddress, role);
		console.log(`Txn: ${response.hash}`);

		// const contractUser = await this.prisma.contractUser.create({
		//   data: {
		//     contract_id: contract_id,
		//     userId: userAddress,
		//     role: role,
		//   }
		// });
		// await response.wait();

		// return contractUser;
	}

	async addClass(
		contract_id: string,
		name: string,
		desc: string,
		total: number
	) {
		const contract = await this.findContract(contract_id);

		const factory = await ethers.getContractFactory(contractSol);
		const factoryContract = factory.attach(contract.contract_id);

		let class_id = 0;
		const response = await factoryContract.addClass(name, total, desc);
		console.log(`Txn: ${response.hash}`);
		const receipt = await response.wait();
		for (const event of receipt.events) {
			if (event.eventSignature === "Return(uint256)") {
				class_id = Number(event.args[0]);
			}
		}
		console.log("addClass: ", class_id.toString());

		const contract_classes = await this.prisma.contract_classes.create({
			data: {
				contract_id,
				class_id: class_id.toString(),
				metadata_url: "",
				name: name,
				desc: desc,
				total: total,
				opensea_url: "",
			},
		});
		return contract_classes;
	}

	async setClassMetadata(
		contract_id: string,
		class_id: string,
		metadata_url: string
	) {
		await this.findContractClass(contract_id, class_id);

		const factory = await ethers.getContractFactory(contractSol);
		const factoryContract = factory.attach(contract_id);

		const response = await factoryContract.setURI(class_id, metadata_url);
		console.log(`Txn: ${response.hash}`);
		console.log("NFT setURI: ", metadata_url);

		const contract_classes = await this.prisma.contract_classes.update({
			where: {
				contract_id_class_id: {
					contract_id,
					class_id,
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
		contract_id: string,
		class_id: string,
		userAddress: string,
		amount: number
	) {
		await this.findContractClass(contract_id, class_id);

		const [deployer] = await ethers.getSigners();
		const factory = await ethers.getContractFactory(contractSol);
		const factoryContract = factory.connect(deployer).attach(contract_id);

		const response = await factoryContract.operatorMint(
			userAddress,
			class_id,
			amount
		);
		console.log(`mint NFT to '${userAddress}' Txn: ${response.hash}`);

		const transaction = await this.prisma.transaction.create({
			data: {
				txnHash: response.hash,
				contract_id,
				class_id,
				from: deployer.address,
				to: userAddress,
				status: -1,
			},
		});
		await response.wait();
		return transaction;
	}

	async transferNFT(
		contract_id: string,
		class_id: string,
		from: string,
		to: string,
		amount: number
	) {
		await this.findContractClass(contract_id, class_id);

		const [deployer] = await ethers.getSigners();
		const factory = await ethers.getContractFactory(contractSol);
		const factoryContract = factory.connect(deployer).attach(contract_id);

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

		const transaction = await this.prisma.transaction.create({
			data: {
				txnHash: response.hash,
				contract_id,
				class_id,
				from: from,
				to: to,
				status: -1,
			},
		});
		// await response.wait();
		return transaction;
	}

	async burnNFT(
		contract_id: string,
		class_id: string,
		userAddress: string,
		amount: number
	) {
		await this.findContractClass(contract_id, class_id);

		const [deployer] = await ethers.getSigners();
		const factory = await ethers.getContractFactory(contractSol);
		const factoryContract = factory.connect(deployer).attach(contract_id);

		const response = await factoryContract.burn(
			userAddress,
			class_id,
			amount
		);
		console.log(`burn NFT from '${userAddress}' Txn: ${response.hash}`);

		const transaction = await this.prisma.transaction.create({
			data: {
				txnHash: response.hash,
				contract_id,
				class_id,
				from: deployer.address,
				to: userAddress,
				status: -1,
			},
		});
		await response.wait();
		return transaction;
	}

	async verify(txnHash: string): Promise<number> {
		const transaction = await this.prisma.transaction.findUnique({
			where: {
				txnHash,
			},
		});

		if (!transaction) {
			throw errors.create(errors.StatusCodes.NOT_FOUND);
		}

		const status = await this.polygon.scanTransaction(transaction.txnHash);

		await this.prisma.transaction.update({
			where: {
				txnHash,
			},
			data: {
				status,
			},
		});

		return status;
	}

	async findContract(contract_id: string) {
		const contract = await this.prisma.contract.findFirst({
			where: {
				contract_id,
			},
		});
		if (!contract) {
			throw errors.create(errors.StatusCodes.NOT_FOUND);
		}
		return contract;
	}

	async findContractClass(contract_id: string, class_id: string) {
		const contract_classes = await this.prisma.contract_classes.findFirst({
			where: {
				contract_id,
				class_id,
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
