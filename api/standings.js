import getData from './get-data.js';
import sortTeamList from '../utils/sort-team-list.js';

export default async function getStandings({ season, leagueID, prefix = '' }) {
  try {
    // Get the standings from the MFL API
    const standingsURL = `/${season}/export?TYPE=leagueStandings&L=${leagueID}&JSON=1`;

    const standingsResponse = await getData(standingsURL);
    const standingsTeams = standingsResponse.leagueStandings.franchise;

    const standings = {};

    standingsTeams.forEach((team) => {
      standings[`${prefix}${team.id}`] = {
        points: Number(team.pf).toFixed(2),
        wins: Number(team.h2hw),
        losses: Number(team.h2hl),
        ties: Number(team.h2ht),
      };
    });

    return sortTeamList(standings, 'points');
  } catch (error) {
    return { error };
  }
}
