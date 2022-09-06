import standingsYearLeague from './standings/year-league.js';
import standingsYear from './standings/year.js';

export default async function apiRoutes(fastify, opts, next) {
  fastify.get('/standings/:year', standingsYear);
  fastify.get('/standings/:season/:leagueID', standingsYearLeague);
  next();
}
