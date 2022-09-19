import getData from './get-data.js';

export default async function getLiveScores({ season, leagueID, prefix = '' }) {
  try {
    // Get the live scores from the MFL API
    const liveScoresURL = `/${season}/export?TYPE=liveScoring&L=${leagueID}&JSON=1`;

    console.log(liveScoresURL);
    const liveScoresResponse = await getData(liveScoresURL);
    const matchups = liveScoresResponse.liveScoring.matchup;

    const liveScores = {};

    matchups.forEach((matchup) => {
      const matchupTeams = matchup.franchise;
      matchupTeams.forEach((team) => {
        const { id, score } = team;
        liveScores[`${prefix}${id}`] = score;
      });
    });
    return liveScores;
  } catch (error) {
    return { error };
  }
}
