export default function scrapeTeamIDLive(row, prefix) {
  const franchiseClass = row.find('.franchisename a').attr('class');
  if (!franchiseClass) {
    return false;
  }
  const teamID = String(franchiseClass.split('_')[1] || '').trim();

  // Optionally add a league prefix (ex. madison) to the team ID
  return `${prefix}${teamID}`;
}
