"use client"
import Animecard from '@/components/CardComponent/Animecards'
import Herosection from '@/components/home/Herosection'
import Navbarcomponent from '@/components/navbar/Navbar'
import { TrendingAnilist, PopularAnilist, Top100Anilist, SeasonalAnilist, CategoriesAnilist, HeroAnilist } from '@/lib/Anilistfunctions'
import React, { useEffect, useState } from 'react'
import { MotionDiv } from '@/utils/MotionDiv'
import VerticalList from '@/components/home/VerticalList'
import ContinueWatching from '@/components/home/ContinueWatching'
import RecentEpisodes from '@/components/home/RecentEpisodes'
import { getAuthSession } from './api/auth/[...nextauth]/route'
import { redis } from '@/lib/rediscache'
import RandomTextComponent from '@/components/RandomTextComponent'
import MangaFeature from '@/components/home/MangaFeature'  // Import the MangaFeature component

async function getHomePage() {
  try {
    let cachedData;
    if (redis) {
      cachedData = await redis.get(`homepage`);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (Object.keys(parsedData).length === 0) { // Check if data is an empty object
          await redis.del(`homepage`);
          cachedData = null;
        }
      }
    }
    if (cachedData) {
      const { herodata, populardata, top100data, seasonaldata, categoriesdata, herosectiondata } = JSON.parse(cachedData);
      return { herodata, populardata, top100data, seasonaldata, categoriesdata, herosectiondata };
    } else {
      const [herodata, populardata, top100data, seasonaldata, categoriesdata, herosectiondata] = await Promise.all([
        TrendingAnilist(),
        PopularAnilist(),
        Top100Anilist(),
        SeasonalAnilist(),
        CategoriesAnilist(),
        HeroAnilist()
      ]);
      const cacheTime = 60 * 60 * 2;
      if (redis) {
        await redis.set(`homepage`, JSON.stringify({ herodata, populardata, top100data, seasonaldata, categoriesdata, herosectiondata }), "EX", cacheTime);
      }
      return { herodata, populardata, top100data, seasonaldata, categoriesdata, herosectiondata };
    }
  } catch (error) {
    console.error("Error fetching homepage from anilist: ", error);
    return null;
  }
}

function Home() {
  const [session, setSession] = useState(null);
  const [data, setData] = useState({
    herodata: [],
    populardata: [],
    top100data: [],
    seasonaldata: [],
    categoriesdata: [],
    herosectiondata: []
  });

  useEffect(() => {
    async function fetchData() {
      const sessionData = await getAuthSession();
      setSession(sessionData);

      const { herodata, populardata, top100data, seasonaldata, categoriesdata, herosectiondata } = await getHomePage();
      setData({ herodata, populardata, top100data, seasonaldata, categoriesdata, herosectiondata });
    }
    fetchData();
  }, []);

  const { herodata, populardata, top100data, seasonaldata, categoriesdata, herosectiondata } = data;

  return (
    <div>
      <Navbarcomponent home={true} />
      <Herosection data={herosectiondata} />
      <div className='sm:max-w-[97%] md:max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] mx-auto flex flex-col md:gap-11 sm:gap-7 gap-5 mt-8'>
        <div>
          <ContinueWatching session={session} />
          <RandomTextComponent />
        </div>
        <div>
          <RecentEpisodes cardid="Recent Episodes" />
        </div>
        <div>
          <Animecard data={herodata} cardid="Trending Now" />
        </div>
        <div>
          <Animecard data={populardata} cardid="All Time Popular" />
        </div>
        <div>
          <MangaFeature /> {/* Add the MangaFeature component */}
        </div>
        <div>
          <Animecard data={categoriesdata} cardid="Categories" />
        </div>
        <div className='lg:flex lg:flex-row justify-between lg:gap-20'>
          <VerticalList data={top100data} mobiledata={seasonaldata} id="Top 100 Anime" />
          <VerticalList data={seasonaldata} id="Seasonal Anime" />
        </div>
      </div>
    </div>
  )
}

export default Home
