import axios from 'axios';

export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await axios.get(`https://graphql.anilist.co`, {
      params: {
        query: `
          query ($search: String) {
            Media(search: $search, type: MANGA) {
              id
              title {
                romaji
                english
                native
              }
              coverImage {
                large
              }
              averageScore
              chapters
              status
            }
          }
        `,
        variables: {
          search: query,
        },
      },
    });

    return res.status(200).json(response.data.data.Media);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
