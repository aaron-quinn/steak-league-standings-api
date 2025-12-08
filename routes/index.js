import standingsYear from './standings.js';
import liveStandingsYear from './live-standings.js';
import fantasyPointsYear from './points.js';
import playersYear from './players.js';
import weekYear from './week.js';

export default async function apiRoutes(fastify, opts, next) {
  fastify.get('/standings/:year', standingsYear);
  fastify.get('/live-standings/:year', liveStandingsYear);
  fastify.get('/points/:year', fantasyPointsYear);
  fastify.get('/players/:year', playersYear);
  fastify.get('/week/:year', weekYear);

  next();
}
