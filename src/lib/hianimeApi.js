import axios from 'axios';

export async function fetchHianimeData(query) {
  try {
    const response = await axios.get(`/api/v2/hianime/search`, { // Update with correct endpoint if known
      params: { q: query }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching data from Hianime API:', error);
    return [];
  }
}
