import axios from 'axios';

export default async function getHTML(url) {
  const { data: html } = await axios(url);
  return html;
}
