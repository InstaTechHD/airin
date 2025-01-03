import React from "react";
import { AnimeInfoAnilist } from '@/lib/Anilistfunctions';
import Navbarcomponent from "@/components/navbar/Navbar";
import { createWatchEp, getEpisode } from "@/lib/EpHistoryfunctions";
import { getAuthSession } from "../../../api/auth/[...nextauth]/route";
import { redis } from '@/lib/rediscache';
import AnimeWatchClient from "./AnimeWatchClient"; // Import the client component

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
    title: "Episode " + epnum + ' - ' + data?.title?.english || data?.title?.romaji || 'Loading...',
    description: data?.description?.slice(0, 180),
    openGraph: {
      title: "Episode " + epnum + ' - ' + data?.title?.english || data?.title?.romaji,
      images: [data?.coverImage?.extraLarge],
      description: data?.description,
    },
    twitter: {
      card: "summary",
      title: "Episode " + epnum + ' - ' + data?.title?.english || data?.title?.romaji,
      description: data?.description?.slice(0, 180),
    },
  }
}

export async function Ephistory(session, aniId, epNum) {
  try {
    let savedep;
    if (session && aniId && epNum) {
      await createWatchEp(aniId, epNum);
      savedep = await getEpisode(aniId, epNum);
    }
    return savedep;
  } catch (error) {
    console.error(error);
    return null;
  }
};

async function AnimeWatch({ params, searchParams }) {
  const session = await getAuthSession();
  const id = searchParams.id;
  const provider = searchParams.host;
  const epNum = searchParams.ep;
  const epId = searchParams.epid;
  const subdub = searchParams.type;
  const data = await getInfo(id);
  const savedep = await Ephistory(session, id, epNum);

  // Mock comments data for demonstration
  const comments = [
    { text: 'Great episode!', isSpoiler: false },
    { text: 'I can’t believe what happened at the end!', isSpoiler: true },
    // Add more comments as needed
  ];

  return (
    <>
      <Navbarcomponent />
      <AnimeWatchClient
        id={id}
        epId={epId}
        provider={provider}
        epNum={epNum}
        data={data}
        subdub={subdub}
        session={session}
        savedep={savedep}
        comments={comments}
      />
    </>
  );
}

export default AnimeWatch;
