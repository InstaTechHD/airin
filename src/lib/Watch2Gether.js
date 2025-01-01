import axios from 'axios';

export async function createWatch2GetherRoom(id, epNum) {
  const apiKey = '3qln6jwk5wjfmqtne5jjes2be7iz3jw46dz1cx5em7hhsdf2hjqlc5e9tg5xyixq'; // Your API key
  const url = `https://w2g.tv/rooms/create.json`;
  
  try {
    const response = await axios.post(url, {
      w2g_api_key: apiKey,
      share: `https://example.com/anime/${id}/episode/${epNum}` // Adjust the URL as needed
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Watch2Gether room:', error);
    return null;
  }
}
