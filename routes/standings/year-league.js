import getStandings from '../../api/standings.js';

export default async function standingsYearLeague(request, reply) {
  const { season, leagueID } = request.params;
  const teams = await getStandings({ season, leagueID });
  if (teams.error) {
    throw new Error(error);
  }
  reply.send(teams);
}
