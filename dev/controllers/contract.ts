import { FastifyInstance } from 'fastify';

import {
  deployContractSchema,
  mintContractNFTSchema,
  addContractClassSchema,
  // setContractClassSchema,
  // addContractAdminSchema,
  // transferContractNFTSchema,
  // burnContractNFTSchema,
  // registerContractEventSchema,
  // queryContractSchema,
  // speedupTransactionSchema,
  // confirmTransactionSchema,
  // verifyTransactionSchema,
} from '../schema/contract';

export default async function contractController(fastify: FastifyInstance) {
  fastify.put(
    '/deploy',
    deployContractSchema(fastify),
    async (request: any, resp: any) => {
      // const { name,  } = request.body;

      const contract = await fastify.service.contract.deployAll(request.body);

      resp.success({
        contract_id: contract,
      });
    }
  );

  // fastify.post(
  //   '/:contract_id/register/:class_id',
  //   registerContractEventSchema(fastify),
  //   async (req, resp) => {
  //     const { contract_id, class_id } = req.params;

  //     const {
  //       organizerId,
  //       eventId,
  //       ticketId,
  //       ticketTypeId,
  //     } = req.body;

  //     const contract = await fastify.service.contract.register(
  //       contract_id,
  //       class_id,
  //       organizerId,
  //       eventId,
  //       ticketId,
  //       ticketTypeId,
  //     );

  //     resp.success(contract);
  //   }
  // );

  // fastify.get(
  //   '/query',
  //   queryContractSchema(fastify),
  //   async (req, resp) => {
  //     const {
  //       organizerId,
  //       eventId,
  //       ticketId,
  //       ticketTypeId,
  //     } = req.query;

  //     const event = await fastify.service.contract.query(
  //       organizerId,
  //       eventId,
  //       ticketId,
  //       ticketTypeId,
  //     );
  //     resp.success({
  //       contract_id: event.contract_id,
  //       class_id: event.class_id,
  //     });
  //   }
  // )

  // fastify.post(
  //   '/:contract_id/admin',
  //   addContractAdminSchema(fastify),
  //   async (req, resp) => {
  //     const { contract_id } = req.params;
  //     const { userAddress } = req.body;

  //     const contractUser = await fastify.service.contract.addAdminUser(contract_id, userAddress);

  //     resp.success({
  //       userId: contractUser.userId,
  //     });
  //   }
  // );

  fastify.put(
    '/:contract_id/class',
    addContractClassSchema(fastify),
    async (request: any, resp: any) => {
      const { contract_id } = request.params;
      // const { name, desc, image_url, slug } = request.body;

      const contractClass = await fastify.service.contract.addClass(contract_id, request.body);

      resp.success({
        class_id: contractClass,
      });
    }
  );

  // fastify.put(
  //   '/:contract_id/class/:class_id',
  //   setContractClassSchema(fastify),
  //   async (req, resp) => {
  //     const { contract_id, class_id } = req.params;
  //     const { metadataUrl } = req.body;

  //     const txn = await fastify.service.contract.setClassMetadata(contract_id, class_id, metadataUrl);

  //     resp.success(txn);
  //   }
  // );

  fastify.put(
    '/:contract_id/mint/:class_id',
    mintContractNFTSchema(fastify),
    async (request: any, resp: any) => {
      const { contract_id, class_id } = request.params;
      const { address } = request.query;

      const { txnHash } = await fastify.service.contract.mintNFT(contract_id, class_id, address );
      resp.success({ txnHash });
    }
  );

  // fastify.post(
  //   '/:contract_id/transfer/:class_id',
  //   transferContractNFTSchema(fastify),
  //   async (req, resp) => {
  //     const { contract_id, class_id } = req.params;
  //     const { from, to, amount } = req.body;

  //     const { txnHash } = await fastify.service.contract.transferNFT(contract_id, class_id, from, to, amount);
  //     resp.success({ txnHash });
  //   }
  // );

  // fastify.post(
  //   '/:contract_id/burn/:class_id',
  //   burnContractNFTSchema(fastify),
  //   async (req, resp) => {
  //     const { contract_id, class_id } = req.params;
  //     const { userAddress, amount } = req.body;

  //     const { txnHash } = await fastify.service.contract.burnNFT(contract_id, class_id, userAddress, amount);
  //     resp.success({ txnHash });
  //   }
  // );

//   fastify.post(
//     '/transaction/speedup',
//     speedupTransactionSchema(fastify),
//     async (req, resp) => {

//       const newTxn = await fastify.service.contract.speedupTransaction();
//       resp.success(newTxn);
//     }
//   );

//   fastify.post(
//     '/transaction/:txnHash/confirm',
//     confirmTransactionSchema(fastify),
//     async (req, resp) => {
//       const { txnHash } = req.params;

//       await fastify.service.contract.confirmTransaction(txnHash);
//       resp.success();
//     }
//   );

//   fastify.post(
//     '/transaction/:txnHash/status',
//     verifyTransactionSchema(fastify),
//     async (req, resp) => {
//       const { txnHash } = req.params;

//       const status = await fastify.service.contract.verify(txnHash);
//       resp.success({ status });
//     }
//   );
}
