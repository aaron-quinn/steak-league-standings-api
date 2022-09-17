import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www65.myfantasyleague.com',
  headers: {
    'Content-type': 'application/json',
  },
});

export default async function getData(url) {
  const { data } = await api.get(url);
  return data;
}
