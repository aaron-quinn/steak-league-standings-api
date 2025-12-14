import getLiveMatchups from '../api/live-matchups.js';
import getDefaults from '../utils/get-defaults.js';

export default async function getLiveMatchupsYear(request, reply) {
  const { season: defaultSeason, leagues } = getDefaults();
  const season = request.params.year || defaultSeason;

  const matchupList = [];

  for (const league of leagues) {
    const { matchups: liveMatchups } = await getLiveMatchups({
      season,
      leagueID: league.id,
      prefix: `${league.name}`,
    });

    liveMatchups.forEach((matchup) => {
      matchupList.push(matchup);
    });
  }

  reply.send(matchupList);
}
