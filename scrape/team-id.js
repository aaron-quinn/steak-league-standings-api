export default function scrapeTeamID(row, prefix) {
  const teamID = row
    .find('.franchisename a')
    .attr('class')
    .split(' ')
    .filter((c) => c.includes('franchise_'))[0]
    .split('_')[1];

  // Optionally add a league prefix (ex. madison) to the team ID
  return `${prefix}${teamID}`;
}
