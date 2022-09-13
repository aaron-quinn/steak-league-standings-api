// ESM
import Fastify from 'fastify';
import cors from '@fastify/cors';
import routes from './routes/index.js';
const fastify = Fastify({ logger: true });
await fastify.register(cors, {
  origin: true,
});

// Register routes
fastify.register(routes);

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
