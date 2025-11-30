import getData from './get-data.js';
import getPlayerList from './players.js';

export default async function getLiveScores({ season, leagueID, prefix = '' }) {
  try {
    // Get the live scores from the MFL API
    const liveScoresURL = `/${season}/export?TYPE=liveScoring&L=${leagueID}&JSON=1`;

    const [liveScoresResponse, players] = await Promise.all([
      getData(liveScoresURL),
      getPlayerList({ season, leagueID }),
    ]);

    const week = liveScoresResponse.liveScoring.week;
    const scheduleURL = `/${season}/export?TYPE=nflSchedule&W=${week}&JSON=1`;
    const scheduleResponse = await getData(scheduleURL);

    const teamSchedule = {};
    if (scheduleResponse.nflSchedule && scheduleResponse.nflSchedule.matchup) {
      scheduleResponse.nflSchedule.matchup.forEach((matchup) => {
        const kickoff = parseInt(matchup.kickoff, 10);
        matchup.team.forEach((t) => {
          teamSchedule[t.id] = kickoff;
        });
      });
    }

    const playerMap = {};
    if (Array.isArray(players)) {
      players.forEach((player) => {
        playerMap[player.id] = {
          name: player.name,
          position: player.position,
          team: player.team,
        };
      });
    }

    const matchups = liveScoresResponse.liveScoring.matchup;
    const teamsOnBye = liveScoresResponse.liveScoring.franchise;

    const liveScores = {};

    const processFranchise = (team) => {
      const { id, score, players: teamPlayersData } = team;
      const teamPlayers = teamPlayersData?.player;

      let yetToPlay = 0;
      let inProgress = 0;
      const yetToPlayNames = [];
      const inProgressNames = [];

      const playersList = Array.isArray(teamPlayers)
        ? teamPlayers
        : teamPlayers
        ? [teamPlayers]
        : [];

      playersList.forEach((player) => {
        if (player.status === 'starter') {
          const remaining = parseInt(player.gameSecondsRemaining, 10);
          const playerInfo = playerMap[player.id] || {
            name: player.id,
            position: '',
          };

          let gameTime = '';
          if (playerInfo.team && teamSchedule[playerInfo.team]) {
            const kickoff = teamSchedule[playerInfo.team];
            const date = new Date(kickoff * 1000);
            gameTime = date.toLocaleString('en-US', {
              weekday: 'short',
              hour: 'numeric',
              minute: 'numeric',
              timeZone: 'America/New_York',
              timeZoneName: 'short',
            });
          }

          const playerResult = {
            ...playerInfo,
            gameTime,
          };

          if (remaining === 3600) {
            yetToPlay++;
            yetToPlayNames.push(playerResult);
          } else if (remaining > 0) {
            inProgress++;
            inProgressNames.push(playerResult);
          }
        }
      });

      liveScores[`${prefix}${id}`] = {
        score,
        yetToPlay,
        inProgress,
        yetToPlayNames,
        inProgressNames,
      };
    };

    (matchups || []).forEach((matchup) => {
      const matchupTeams = matchup.franchise;
      matchupTeams.forEach(processFranchise);
    });

    if (teamsOnBye) {
      const byeTeams = Array.isArray(teamsOnBye) ? teamsOnBye : [teamsOnBye];
      byeTeams.forEach(processFranchise);
    }

    return liveScores;
  } catch (error) {
    return { error };
  }
}
