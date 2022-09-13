export default function scrapeWinLossTie(row) {
  return row.find('td.h2hwlt').text() || '0-0-0';
}
