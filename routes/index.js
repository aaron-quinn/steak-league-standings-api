import standingsYearLeague from './standings/year-league.js';
import standingsYear from './standings/year.js';
import liveStandingsYearLeague from './live-standings/year-league.js';
import liveStandingsYear from './live-standings/year.js';

export default async function apiRoutes(fastify, opts, next) {
  fastify.get('/standings/:year', standingsYear);
  fastify.get('/standings/:season/:leagueID', standingsYearLeague);
  fastify.get('/live-standings/:year', liveStandingsYear);
  fastify.get('/live-standings/:season/:leagueID', liveStandingsYearLeague);
  next();
}
