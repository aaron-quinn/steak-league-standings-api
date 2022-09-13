// ESM
import Fastify from 'fastify';
import routes from './routes/index.js';
const fastify = Fastify({ logger: true });

// Register routes
fastify.register(routes);

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
