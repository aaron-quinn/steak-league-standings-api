import getStandings from '../api/standings.js';
import getLiveScores from '../api/live-scores.js';
import getDefaults from '../utils/get-defaults.js';
import sortTeamList from '../utils/sort-team-list.js';

export default async function standingsYear(request, reply) {
  const { season: defaultSeason, leagues } = getDefaults();
  const season = request.params.year || defaultSeason;

  const teamList = {};

  for (const league of leagues) {
    const teams = await getStandings({
      season,
      leagueID: league.id,
      prefix: `${league.name}`,
    });
    if (teams.error) {
      throw new Error(teams.error);
    }

    Object.entries(teams).forEach((team) => {
      const [teamID, teamData] = team;
      teamList[teamID] = teamData;
    });

    const liveScores = await getLiveScores({
      season,
      leagueID: league.id,
      prefix: `${league.name}`,
    });

    Object.entries(teamList).map((team) => {
      const [teamID, teamData] = team;
      if (!liveScores[teamID]) {
        return team;
      }
      teamList[teamID] = teamData;
      teamList[teamID].points =
        Number(liveScores[teamID]) + Number(teamData.points);
      teamList[teamID].points = (
        Math.round(teamList[teamID].points * 100) / 100
      ).toFixed(2);
      return team;
    });
  }

  reply.send(sortTeamList(teamList, 'points'));
}
