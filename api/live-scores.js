import getData from './get-data.js';

export default async function getLiveScores({ season, leagueID, prefix = '' }) {
  try {
    // Get the live scores from the MFL API
    const liveScoresURL = `/${season}/export?TYPE=liveScoring&L=${leagueID}&JSON=1`;

    const liveScoresResponse = await getData(liveScoresURL);
    const matchups = liveScoresResponse.liveScoring.matchup;
    const teamsOnBye = liveScoresResponse.liveScoring.franchise;

    const liveScores = {};

    (matchups || []).forEach((matchup) => {
      const matchupTeams = matchup.franchise;
      matchupTeams.forEach((team) => {
        const { id, score } = team;
        liveScores[`${prefix}${id}`] = score;
      });
    });
    (teamsOnBye || []).forEach((teamOnBye) => {
      const { id, score } = teamOnBye;
      liveScores[`${prefix}${id}`] = score;
    });

    return liveScores;
  } catch (error) {
    return { error };
  }
}
