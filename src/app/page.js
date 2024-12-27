"use server"
import Animecard from '@/components/CardComponent/Animecards'
import Herosection from '@/components/home/Herosection'
import Navbarcomponent from '@/components/navbar/Navbar'
import { TrendingAnilist, PopularAnilist, Top100Anilist, SeasonalAnilist, getAnimeByYear } from '@/lib/Anilistfunctions'
import React from 'react'
import { MotionDiv } from '@/utils/MotionDiv'
import VerticalList from '@/components/home/VerticalList'
import ContinueWatching from '@/components/home/ContinueWatching'
import RecentEpisodes from '@/components/home/RecentEpisodes'
import NotYetReleasedEpisodes from '@/components/home/NotYetReleasedEpisodes';
import NewAnimeList from '@/components/home/NewAnimeList'; // Import the new component
import { getAuthSession } from './api/auth/[...nextauth]/route'
import { redis } from '@/lib/rediscache'
import RandomTextComponent from '@/components/RandomTextComponent';

async function getHomePage() {
  try {
    const currentYear = new Date().getFullYear();
    let cachedData;
    if (redis) {
      cachedData = await redis.get(`homepage-${currentYear}`);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (Object.keys(parsedData).length === 0) { // Check if data is an empty object
          await redis.del(`homepage-${currentYear}`);
          cachedData = null;
        }
      }
    }
    if (cachedData) {
      const { herodata, populardata, top100data, seasonaldata, newAnimeData } = JSON.parse(cachedData);
      return { herodata, populardata, top100data, seasonaldata, newAnimeData };
    } else {
      const [herodata, populardata, top100data, seasonaldata, newAnimeData] = await Promise.all([
        TrendingAnilist(),
        PopularAnilist(),
        Top100Anilist(),
        SeasonalAnilist(),
        getAnimeByYear(2016, currentYear) // Fetch new anime from 2016 to the current year
      ]);
      const cacheTime = 60 * 60 * 2;
      if (redis) {
        await redis.set(`homepage-${currentYear}`, JSON.stringify({ herodata, populardata, top100data, seasonaldata, newAnimeData }), "EX", cacheTime);
      }
      return { herodata, populardata, top100data, seasonaldata, newAnimeData };
    }
  } catch (error) {
    console.error("Error fetching homepage from anilist: ", error);
    return null;
  }
}

async function Home() {
  const session = await getAuthSession();
  const { herodata = [], populardata = [], top100data = [], seasonaldata = [], newAnimeData = [] } = await getHomePage();

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
          <NotYetReleasedEpisodes data={notYetReleasedData} />
        </div>
        <div>
          <NewAnimeList data={newAnimeData} /> {/* Add the new component */}
        </div>
        <div>
          <div className='lg:flex lg:flex-row justify-between lg:gap-20'>
            <VerticalList data={top100data} mobiledata={seasonaldata} id="Top 100 Anime" />
            <VerticalList data={seasonaldata} id="Seasonal Anime" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
