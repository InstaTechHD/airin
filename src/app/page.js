"use server"
import Animecard from '@/components/CardComponent/Animecards'
import Herosection from '@/components/home/Herosection'
import Navbarcomponent from '@/components/navbar/Navbar'
import { TrendingAnilist, PopularAnilist, Top100Anilist, SeasonalAnilist, UpcomingAnilist } from '@/lib/Anilistfunctions'
import React from 'react'
import { MotionDiv } from '@/utils/MotionDiv'
import VerticalList from '@/components/home/VerticalList'
import ContinueWatching from '@/components/home/ContinueWatching'
import RecentEpisodes from '@/components/home/RecentEpisodes'
import NotYetReleasedEpisodes from '@/components/home/NotYetReleasedEpisodes';
import { getAuthSession } from './api/auth/[...nextauth]/route'
import { redis } from '@/lib/rediscache'
import RandomTextComponent from '@/components/RandomTextComponent';
import { FaArrowRight } from 'react-icons/fa'; // Importing an icon from react-icons

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
      const { herodata, populardata, top100data, seasonaldata, upcomingdata } = JSON.parse(cachedData);
      return { herodata, populardata, top100data, seasonaldata, upcomingdata: upcomingdata.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)) };
    } else {
      const [herodata, populardata, top100data, seasonaldata, upcomingdata] = await Promise.all([
        TrendingAnilist(),
        PopularAnilist(),
        Top100Anilist(),
        SeasonalAnilist(),
        UpcomingAnilist() // Fetch upcoming releases
      ]);
      const sortedUpcomingData = upcomingdata.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      const cacheTime = 60 * 60 * 2;
      if (redis) {
        await redis.set(`homepage`, JSON.stringify({ herodata, populardata, top100data, seasonaldata, upcomingdata: sortedUpcomingData }), "EX", cacheTime);
      }
      return { herodata, populardata, top100data, seasonaldata, upcomingdata: sortedUpcomingData };
    }
  } catch (error) {
    console.error("Error fetching homepage from anilist: ", error);
    return null;
  }
}

async function Home() {
  const session = await getAuthSession();
  const { herodata = [], populardata = [], top100data = [], seasonaldata = [], upcomingdata = [] } = await getHomePage();

  return (
    <div>
      <Navbarcomponent home={true} />
      <Herosection data={herodata} />
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
          <h2 className='text-xl font-bold'>Upcoming Releases <FaArrowRight /></h2>
          {upcomingdata.map(anime => (
            <div key={anime.id} className='flex items-center space-x-2'>
              <span>{anime.title}</span>
              <FaArrowRight className='text-blue-500 cursor-pointer' onClick={() => window.location.href = anime.url} />
            </div>
          ))}
        </div>
        <div>
          <div className='lg:flex lg:flex-row justify-between lg:gap-20'>
            <VerticalList data={top100data} mobiledata={seasonaldata} id="Top 100 Anime" />
            <VerticalList data={seasonaldata} id="Seasonal Anime" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
