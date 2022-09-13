// ESM
import Fastify from 'fastify';
import cors from '@fastify/cors';
import routes from './routes/index.js';
const fastify = Fastify({ logger: true });
await fastify.register(cors, {
  origin: (origin, cb) => {
    const hostname = new URL(origin).hostname;
    if (
      ['localhost', 'steakstandings', 'steakstandings.com'].includes(hostname)
    ) {
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
    cb(new Error('Not allowed'), false);
  },
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
