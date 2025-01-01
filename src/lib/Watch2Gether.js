import axios from 'axios';

export async function createWatch2GetherRoom(id, epNum) {
  const apiKey = process.env.WATCH2GETHER_API_KEY; // Use environment variable
  const url = `https://w2g.tv/rooms/create.json`;

  try {
    const response = await axios.post(url, {
      w2g_api_key: apiKey,
      share: `https://makima.xyz/anime/${id}/episode/${epNum}` // Use your actual website's URL
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Watch2Gether room:', error);
    return null;
  }
}
