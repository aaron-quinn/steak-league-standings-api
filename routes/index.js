export default function apiRoutes(fastify, opts, next) {
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });
  next();
}
