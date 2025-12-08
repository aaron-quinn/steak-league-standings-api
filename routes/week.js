import getLiveScores from '../api/live-scores.js';
import getDefaults from '../utils/get-defaults.js';

export default async function getWeek(request, reply) {
  const { season: defaultSeason, leagues } = getDefaults();
  const season = request.params.year || defaultSeason;
  // Just use the first league to get the week
  const league = leagues[0];

  const { week } = await getLiveScores({
    season,
    leagueID: league.id,
    prefix: `${league.name}`,
  });

  reply.send({ week });
}
