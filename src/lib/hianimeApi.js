import axios from 'axios';

export async function fetchHianimeData(query) {
  try {
    const response = await axios.get(`https://aniwatch-api-flax.vercel.app/search`, {
      params: { q: query }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching data from Hianime API:', error);
    return [];
  }
}
