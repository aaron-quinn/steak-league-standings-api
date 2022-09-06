export default function scrapeTeamPoints(row) {
  return row.find('td.total_points').text() || 0.0;
}
