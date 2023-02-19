import fp from 'fastify-plugin';

export default fp(async (fastify:any, _:any, done:any) => {
  done();

  // listen new transaction for deployer address
  await fastify.alchemy.initDeployerAddress();
  // await fastify.alchemy.listen(fastify);

  // speedup exist pending transaction
  // try {
  //   await fastify.service.contract.speedupTransaction();
  // } catch (e) {
  //   fastify.log.error(`speedup transaction failed`, e.message);
  // }

}, {
  fastify: '4.x',
  // name: 'crowdserve-listen',
  dependencies: [
    // 'crowdserve-config',
    // 'crowdserve-service',
    'fastify-alchemy-client',
    // 'fastify-redis-client',
  ]
});