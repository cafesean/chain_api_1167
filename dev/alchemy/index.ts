import { Alchemy } from "alchemy-sdk";
import { ethers } from 'hardhat';
// import { FastifyInstance } from "fastify";
import {
  TransactionResponse,
  TransactionReceipt
} from "@ethersproject/providers";


export default class AlchemyClient {
  private readonly alchemy: Alchemy;
  deployerAddress: string = "";

  constructor(
    private readonly apiKey: string,
    private readonly network: any,
  ) {
    this.alchemy = new Alchemy({
      apiKey: this.apiKey,
      network: this.network,
    });
  }

  async initDeployerAddress(): Promise<string> {
    if (!this.deployerAddress) {
      const [deployer] = await ethers.getSigners();
      this.deployerAddress = await deployer.getAddress();
    }
    return this.deployerAddress;
  }

  // async listen(fastify: FastifyInstance) {
  //   this.alchemy.ws.on({
  //     method: AlchemySubscription.PENDING_TRANSACTIONS,
  //     fromAddress: this.deployerAddress,
  //   }, async (transaction) => {
  //     // push to queue to wait confirm transaction
  //     try {
  //       await fastify.client.schedule.newContractTransaction(transaction.hash);
  //     } catch (e) {
  //       fastify.log.error(`schedule new transaction failed`, transaction.hash, e.message);
  //     }
  //   });
  // }

  async getTransaction(hash: string): Promise<TransactionResponse | null> {
    return await this.alchemy.core.getTransaction(hash);
  }

  async getTransactionReceipt(hash: string): Promise<TransactionReceipt | null> {
    return await this.alchemy.core.getTransactionReceipt(hash);
  }

  async getTransactionCount(status?: string): Promise<number> {
    for (let i = 0; i < 3; i++) {
      const count = await this.alchemy.core.getTransactionCount(this.deployerAddress, status);
      if (count > 0) {
        return count;
      }
    }
    return 0;
  }

  // async simulateAssetChangesError(hash: string): Promise<string> {
  //   const { error } = await this.alchemy.transact.simulateAssetChanges(hash);
  //   return error ? error.message: "";
  // }
}
