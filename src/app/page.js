"use server";
import Link from 'next/link';
import Animecard from '@/components/CardComponent/Animecards';
import Herosection from '@/components/home/Herosection';
import Navbarcomponent from '@/components/navbar/Navbar';
import { TrendingAnilist, PopularAnilist, Top100Anilist, SeasonalAnilist } from '@/lib/Anilistfunctions';
import React from 'react';
import { MotionDiv } from '@/utils/MotionDiv';
import VerticalList from '@/components/home/VerticalList';
import ContinueWatching from '@/components/home/ContinueWatching';
import RecentEpisodes from '@/components/home/RecentEpisodes';
import { getAuthSession } from './api/auth/[...nextauth]/route';
import { redis } from '@/lib/rediscache';
import RandomTextComponent from '@/components/RandomTextComponent';
// import { getWatchHistory } from '@/lib/EpHistoryfunctions';

async function getHomePage() {
  try {
    let cachedData;
    if (redis) {
      cachedData = await redis.get('homepage');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (Object.keys(parsedData).length === 0) {
          await redis.del('homepage');
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
        SeasonalAnilist(),
      ]);
      const cacheTime = 60 * 60 * 2;
      if (redis) {
        await redis.set('homepage', JSON.stringify({ herodata, populardata, top100data, seasonaldata }), 'EX', cacheTime);
      }
      return { herodata, populardata, top100data, seasonaldata };
    }
  } catch (error) {
    console.error('Error fetching homepage from anilist: ', error);
    return null;
  }
}

async function Home() {
  const session = await getAuthSession();
  const { herodata = [], populardata = [], top100data = [], seasonaldata = [] } = await getHomePage();
  // const history = await getWatchHistory();
  // console.log(history);

  return (
    <div>
      <Navbarcomponent home={true} />
      <Herosection data={herodata} />
      <div className="sm:max-w-[97%] md:max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] mx-auto flex flex-col md:gap-11 sm:gap-7 gap-5 mt-8">
        <div>
          <ContinueWatching session={session} />
          <RandomTextComponent />
        </div>
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Episodes</h2>
            <div>
              <button className="px-4 py-2 text-sm font-medium bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                View All
              </button>
            </div>
          </div>
          <RecentEpisodes cardid="Recent Episodes" />
        </div>
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Trending Now</h2>
            <div>
              <button className="px-4 py-2 text-sm font-medium bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                View All
              </button>
            </div>
          </div>
          <Link href="https://makima.xyz/anime/catalog?sortby=TRENDING_DESC">
            <Animecard data={herodata} cardid="Trending Now" />
          </Link>
        </div>
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">All Time Popular</h2>
            <div>
              <button className="px-4 py-2 text-sm font-medium bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                View All
              </button>
            </div>
          </div>
          <Link href="https://makima.xyz/anime/catalog?sortby=">
            <Animecard data={populardata} cardid="All Time Popular" />
          </Link>
        </div>
        <div>
          <div className="lg:flex lg:flex-row justify-between lg:gap-20">
            <VerticalList data={top100data} mobiledata={seasonaldata} id="Top 100 Anime" />
            <VerticalList data={seasonaldata} id="Seasonal Anime" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
