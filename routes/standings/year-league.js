import scrapeStandings from '../../scrape/standings.js';

export default async function standingsYearLeague(request, reply) {
  const { season, leagueID } = request.params;
  const teams = await scrapeStandings({ season, leagueID });
  if (teams.error) {
    throw new Error(error);
  }
  reply.send(teams);
}
