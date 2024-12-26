import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Dummy implementation: Replace with actual watchlist management logic
  if (req.method === 'GET') {
    return res.status(200).json({ watchlist: [] });
  } else if (req.method === 'POST') {
    const { animeId } = req.body;
    if (!animeId) {
      return res.status(400).json({ error: 'Anime ID is required' });
    }

    // Add to watchlist logic
    return res.status(201).json({ message: 'Added to watchlist' });
  } else if (req.method === 'DELETE') {
    const { animeId } = req.body;
    if (!animeId) {
      return res.status(400).json({ error: 'Anime ID is required' });
    }

    // Remove from watchlist logic
    return res.status(200).json({ message: 'Removed from watchlist' });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
