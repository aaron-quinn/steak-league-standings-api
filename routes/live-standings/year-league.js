import scrapeStandingsLive from '../../scrape/live-standings.js';
export default async function standingsYearLeague(request, reply) {
  const { season, leagueID } = request.params;
  const teams = await scrapeStandingsLive({ season, leagueID });
  if (teams.error) {
    throw new Error(teams.error);
  }
  reply.send(teams);
}
