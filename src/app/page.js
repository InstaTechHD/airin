"use server"
import Animecard from '@/components/CardComponent/Animecards'
import Herosection from '@/components/home/Herosection'
import Navbarcomponent from '@/components/navbar/Navbar'
import { TrendingAnilist, PopularAnilist, Top100Anilist, SeasonalAnilist } from '@/lib/Anilistfunctions'
import React from 'react'
import { MotionDiv } from '@/utils/MotionDiv'
import VerticalList from '@/components/home/VerticalList'
import ContinueWatching from '@/components/home/ContinueWatching'
import RecentEpisodes from '@/components/home/RecentEpisodes'
import { getAuthSession } from './api/auth/[...nextauth]/route'
import { redis } from '@/lib/rediscache'
// import { getWatchHistory } from '@/lib/EpHistoryfunctions'

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
      const { herodata, populardata, top100data, seasonaldata } = JSON.parse(cachedData);
      return { herodata, populardata, top100data, seasonaldata };
    } else {
      const [herodata, populardata, top100data, seasonaldata] = await Promise.all([
        TrendingAnilist(),
        PopularAnilist(),
        Top100Anilist(),
        SeasonalAnilist()
      ]);
      const cacheTime = 60 * 60 * 2;
      if (redis) {
        await redis.set(`homepage`, JSON.stringify({ herodata, populardata, top100data, seasonaldata }), "EX", cacheTime);
      }
      return { herodata, populardata, top100data, seasonaldata };
    }
  } catch (error) {
    console.error("Error fetching homepage from anilist: ", error);
    return null;
  }
}

async function Home() {
  const session = await getAuthSession();
  const { herodata = [], populardata = [], top100data = [], seasonaldata = [] } = await getHomePage();
  // const history = await getWatchHistory();
  // console.log(history)
  
  return (
    <div>
      <Navbarcomponent home={true} />
      <Herosection data={herodata} />
      <div className='sm:max-w-[97%] md:max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] mx-auto flex flex-col md:gap-11 sm:gap-7 gap-5 mt-8'>
        <div
        >
          <ContinueWatching session={session} />
        </div>
        <div
        >
    
          <RecentEpisodes cardid="Recent Episodes" />
        </div>
        <div
        >
/*Linkvertise Ad Banner*/
        <iframe src="https://publisher.linkvertise.com/cdn/ads/LV-468x60/index.html" frameborder="0" height="60" width="468"></iframe><a href="https://publisher.linkvertise.com/ac/101337" target="_blank" style="position: absolute; top: 0; bottom: 0; left: 0; right: 0;"></a>
    /*Linkvertise Ad Banner End*/
    
          <Animecard data={herodata} cardid="Trending Now" />
        </div>
        <div
        >
          <Animecard data={populardata} cardid="All Time Popular" />
        </div>
        <div
        >
          <div className='lg:flex lg:flex-row justify-between lg:gap-20'>
            <VerticalList data={top100data} mobiledata={seasonaldata} id="Top 10 Anime" />
            <VerticalList data={seasonaldata} id="Seasonal Anime" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
