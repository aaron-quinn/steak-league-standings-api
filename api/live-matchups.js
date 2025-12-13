import getData from './get-data.js';
import getPlayerList from './players.js';

const scheduleCache = {};

export default async function getLiveMatchups({
  season,
  leagueID,
  prefix = '',
}) {
  try {
    // Get the live scores from the MFL API
    const liveScoresURL = `/${season}/export?TYPE=liveScoring&L=${leagueID}&DETAILS=1&JSON=1`;

    const [liveScoresResponse, players] = await Promise.all([
      getData(liveScoresURL),
      getPlayerList({ season, leagueID }),
    ]);

    const week = liveScoresResponse.liveScoring.week;

    let scheduleResponse;
    const scheduleKey = `${season}-${week}`;
    if (scheduleCache[scheduleKey]) {
      scheduleResponse = scheduleCache[scheduleKey];
    } else {
      const scheduleURL = `/${season}/export?TYPE=nflSchedule&W=${week}&JSON=1`;
      scheduleResponse = await getData(scheduleURL);
      scheduleCache[scheduleKey] = scheduleResponse;
    }

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
    const matchupData = [];

    const processFranchise = (team) => {
      const { id, score, players: teamPlayersData } = team;
      const teamPlayers = teamPlayersData?.player;

      let yetToPlay = 0;
      let inProgress = 0;
      let completed = 0;
      let benched = 0;
      const yetToPlayNames = [];
      const inProgressNames = [];
      const completedNames = [];
      const benchedNames = [];

      const playersList = Array.isArray(teamPlayers)
        ? teamPlayers
        : teamPlayers
        ? [teamPlayers]
        : [];

      playersList.forEach((player) => {
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
          score: player.score,
        };

        if (player.status === 'starter') {
          if (remaining === 3600) {
            yetToPlay++;
            yetToPlayNames.push(playerResult);
          } else if (remaining > 0) {
            inProgress++;
            inProgressNames.push(playerResult);
          } else {
            completed++;
            completedNames.push(playerResult);
          }
        } else if (player.status === 'nonstarter') {
          benched++;
          benchedNames.push(playerResult);
        }
      });

      liveScores[`${prefix}${id}`] = {
        score,
        yetToPlay,
        inProgress,
        yetToPlayNames,
        inProgressNames,
        completedNames,
        benchedNames,
      };
    };

    (matchups || []).forEach((matchup) => {
      const matchupTeams = matchup.franchise;
      matchupTeams.forEach(processFranchise);

      const team1ID = matchupTeams[0]?.id ?? null;
      const team2ID = matchupTeams[1]?.id ?? null;

      let currentMatchup = [];
      if (team1ID !== null) {
        currentMatchup.push({
          franchiseID: `${prefix}${team1ID}`,
          ...liveScores[`${prefix}${team1ID}`],
        });
      }
      if (team2ID !== null) {
        currentMatchup.push({
          franchiseID: `${prefix}${team2ID}`,
          ...liveScores[`${prefix}${team2ID}`],
        });
      }

      matchupData.push(currentMatchup);
    });

    if (teamsOnBye) {
      const byeTeams = Array.isArray(teamsOnBye) ? teamsOnBye : [teamsOnBye];
      byeTeams.forEach(processFranchise);

      byeTeams.forEach((team) => {
        const teamID = team?.id ?? null;
        if (teamID !== null) {
          matchupData.push([
            {
              franchiseID: `${prefix}${teamID}`,
              ...liveScores[`${prefix}${teamID}`],
            },
          ]);
        }
      });
    }

    return {
      week,
      matchups: matchupData,
    };
  } catch (error) {
    return { error };
  }
}
