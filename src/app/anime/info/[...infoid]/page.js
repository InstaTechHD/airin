import Episodesection from '@/components/Episodesection'
import { AnimeInfoAnilist } from '@/lib/Anilistfunctions'
import React from 'react'
import AnimeDetailsTop from '@/components/details/AnimeDetailsTop'
import AnimeDetailsBottom from '@/components/details/AnimeDetailsBottom'
import Navbarcomponent from '@/components/navbar/Navbar'
import Animecards from '@/components/CardComponent/Animecards'
import { getAuthSession } from '@/app/api/auth/[...nextauth]/route'
import { redis } from '@/lib/rediscache'
import DetailsContainer from './DetailsContainer'

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

export async function generateMetadata({ params }) {
  const id = params.infoid[0];
  const data = await getInfo(id);
  
  return {
    title: data?.title?.english || data?.title?.romaji || 'Loading...',
    description: data?.description.slice(0, 180),
    openGraph: {
      title: data?.title?.english || data?.title?.romaji,
      images: [data?.coverImage?.extraLarge],
      description: data?.description,
    },
    twitter: {
      card: "summary",
      title: data?.title?.english || data?.title?.romaji,
      description: data?.description?.slice(0, 180),
    },
  }
}

async function AnimeDetails({ params }) {
  const session = await getAuthSession();
  const id = params.infoid[0];
  const data = await AnimeInfoAnilist(id);

  return (
    <div className="">
      <Navbarcomponent />
      <DetailsContainer data={data} id={id} session={session}/>
      <div className="anilist-trailer-section">
        <a href={`https://anilist.co/anime/${id}`} target="_blank" rel="noopener noreferrer">
          <img src="/path/to/anilist-icon.png" alt="AniList" className="anilist-icon" />
        </a>
        {data.trailer && data.trailer.site === 'youtube' && (
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${data.trailer.id}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
        <a href={`https://ggredi.info/download/${id}`} className="download-link" target="_blank" rel="noopener noreferrer">
          Download from ggredi.info
        </a>
      </div>
    </div>
  )
}

export default AnimeDetails
