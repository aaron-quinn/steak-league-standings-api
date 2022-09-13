export default function scrapeTeamPointsLive(row) {
  return row.find('td.points:nth-last-child(2)').text() || 0.0;
}
