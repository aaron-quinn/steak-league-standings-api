import * as cheerio from 'cheerio';
import getHTML from '../utils/get-html.js';
import scrapeTeamPoints from './team-points.js';
import scrapeTeamID from './team-id.js';
import sortTeamList from '../utils/sort-team-list.js';
import scrapeWinLossTie from './win-loss-tie.js';

export default async function scrapeStandings({
  season,
  leagueID,
  prefix = '',
}) {
  try {
    // Get the HTML from the standings page and load it into Cheerio
    const standingsURL = `https://www65.myfantasyleague.com/${season}/options?L=${leagueID}&O=101&SORT=PTS`;
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

      const points = scrapeTeamPoints($(row));
      const winLossTie = scrapeWinLossTie($(row));
      const teamID = scrapeTeamID($(row), prefix);

      teams[teamID] = {
        points: Number(points).toFixed(2),
        wins: Number(winLossTie.split('-')[0]),
        losses: Number(winLossTie.split('-')[1]),
        ties: Number(winLossTie.split('-')[2]),
      };
    });

    return sortTeamList(teams, 'points');
  } catch (error) {
    return { error };
  }
}
