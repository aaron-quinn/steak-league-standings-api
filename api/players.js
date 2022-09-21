import getData from './get-data.js';

export default async function getPlayerList({
  season,
  leagueID = '68362',
  prefix = '',
}) {
  try {
    // Get the player list from the MFL API
    const playerListURL = `/${season}/export?TYPE=players&L=${leagueID}&JSON=1`;

    const playerListResponse = await getData(playerListURL);
    const players = playerListResponse.players.player;

    return players.map((player) => {
      const [lastName, firstName] = player.name.split(', ');
      player.name = `${firstName} ${lastName}`;
      return player;
    });
  } catch (error) {
    return { error };
  }
}
