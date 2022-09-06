import scrapeStandings from '../../scrape/standings.js';
import getDefaults from '../../util/get-defaults.js';
import sortTeamList from '../../util/sort-team-list.js';

export default async function standingsYear(request, reply) {
  const { season: defaultSeason, leagues } = getDefaults();
  const season = request.params.year || defaultSeason;

  const teamList = {};

  for (const league of leagues) {
    const teams = await scrapeStandings({
      season,
      leagueID: league.id,
      prefix: `${league.name}`,
    });
    if (teams.error) {
      throw new Error(error);
    }

    Object.entries(teams).forEach((team) => {
      const [teamID, teamData] = team;
      teamList[teamID] = teamData;
    });
  }

  reply.send(sortTeamList(teamList, 'points'));
}
