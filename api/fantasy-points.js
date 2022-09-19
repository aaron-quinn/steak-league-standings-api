import getData from './get-data.js';
import getMFLPlayers from '../utils/mfl-players.js';

export default async function getFantasyPoints({
  season,
  leagueID = '68362',
  prefix = '',
}) {
  try {
    // Get the fantasy points from the MFL API
    const fantasyPtsURL = `/${season}/export?TYPE=playerScores&L=${leagueID}&W=YTD&YEAR=${season}&JSON=1`;

    const fantasyPtsResponse = await getData(fantasyPtsURL);
    const playersWithPoints = fantasyPtsResponse.playerScores.playerScore;
    const mflPlayers = getMFLPlayers();

    // Match up the array of players with points to the array of players from the MFL API
    const players = playersWithPoints.map((player) => {
      const mflPlayer = mflPlayers.find((p) => p.id === player.id);
      console.log(player);
      return {
        ...mflPlayer,
        points: player.score,
      };
    });
    return players;
  } catch (error) {
    return { error };
  }
}
