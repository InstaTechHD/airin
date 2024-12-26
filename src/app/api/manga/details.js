import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'ID parameter is required' });
  }

  try {
    const response = await axios.get(`https://graphql.anilist.co`, {
      params: {
        query: `
          query ($id: Int) {
            Media(id: $id, type: MANGA) {
              id
              title {
                romaji
                english
                native
              }
              coverImage {
                large
              }
              description
              averageScore
              chapters
              status
            }
          }
        `,
        variables: {
          id: parseInt(id),
        },
      },
    });

    return res.status(200).json(response.data.data.Media);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
