import { AnimeInfoAnilist } from '@/lib/Anilistfunctions';
import { redis } from '@/lib/rediscache';

async function getInfo(id) {
  try {
    let cachedData;
    if (redis) {
      cachedData = await redis.get(`info:${id}`);
      if (!JSON.parse(cachedData)) {
        await redis.del(`info:${id}`);
        cachedData = null;
      }
    }
    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      const data = await AnimeInfoAnilist(id);
      const cacheTime = data?.nextAiringEpisode?.episode ? 60 * 60 * 2 : 60 * 60 * 24 * 45;
      if (redis && data !== null && data) {
        await redis.set(`info:${id}`, JSON.stringify(data), "EX", cacheTime);
      }
      return data;
    }
  } catch (error) {
    console.error("Error fetching info: ", error);
  }
}

export async function generateMetadata({ params, searchParams }) {
  const id = searchParams?.id;
  const data = await getInfo(id);
  const epnum = searchParams?.ep;

  return {
    title: "Episode " + epnum + ' - ' + (data?.title?.english || data?.title?.romaji || 'Loading...'),
    description: data?.description?.slice(0, 180),
    openGraph: {
      title: "Episode " + epnum + ' - ' + (data?.title?.english || data?.title?.romaji),
      images: [data?.coverImage?.extraLarge],
      description: data?.description,
    },
    twitter: {
      card: "summary",
      title: "Episode " + epnum + ' - ' + (data?.title?.english || data?.title?.romaji),
      description: data?.description?.slice(0, 180),
    },
  }
}
