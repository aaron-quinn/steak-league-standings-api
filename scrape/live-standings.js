import * as cheerio from 'cheerio';
import getHTML from '../utils/get-html.js';
import sortTeamList from '../utils/sort-team-list.js';
import scrapeTeamPointsLive from './live-team-points.js';
import scrapeTeamIDLive from './live-team-id.js';

export default async function scrapeStandingsLive({
  season,
  leagueID,
  prefix = '',
}) {
  try {
    // Get the HTML from the standings page and load it into Cheerio
    const standingsURL = `https://www65.myfantasyleague.com/${season}/options?LEAGUE_ID=${leagueID}&END_WEEK=18&OPTION=23&SORT=TOTAL`;
    const standingsHTML = await getHTML(standingsURL);
    const $ = cheerio.load(standingsHTML);

    // This is where we'll store the list of teams
    const teams = {};

    // Let's scrape the standings table
    $('.mobile-wrap tr').each((i, row) => {
      // Skip the non-team rows at the top of the table
      if ($(row).attr('class') === undefined) {
        return;
      }

      const points = scrapeTeamPointsLive($(row));
      const teamID = scrapeTeamIDLive($(row), prefix);
      if (!teamID) {
        return false;
      }

      teams[teamID] = {
        points: Number(points).toFixed(2),
        wins: 0,
        losses: 0,
        ties: 0,
      };
    });

    return sortTeamList(teams, 'points');
  } catch (error) {
    return { error };
  }
}
