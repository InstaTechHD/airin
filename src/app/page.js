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
        await redis.set(
          'homepage',
          JSON.stringify({ herodata, populardata, top100data, seasonaldata }),
          'EX',
          cacheTime
        );
      }
      return { herodata, populardata, top100data, seasonaldata };
    }
  } catch (error) {
    console.error('Error fetching homepage from anilist: ', error);
    return null;
  }
}

function getRandomAnime(data) {
  return data[Math.floor(Math.random() * data.length)];
}

async function Home() {
  const session = await getAuthSession();
  const { herodata = [], populardata = [], top100data = [], seasonaldata = [] } = await getHomePage();
  const randomAnime = getRandomAnime(herodata);

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
          <RecentEpisodes cardid="Recent Episodes" />
        </div>
        <div className="featured-anime-card my-6">
          <h2 className="text-xl font-bold mb-3">Featured Anime</h2>
          <Link href={`https://makima.xyz/anime/${randomAnime?.id}`}>
            <a className="block border rounded-lg p-4 shadow-lg bg-gray-100 hover:bg-gray-200">
              <h3 className="text-lg font-semibold">{randomAnime?.title?.romaji}</h3>
              <p className="text-sm mt-2">{randomAnime?.description?.slice(0, 100)}...</p>
            </a>
          </Link>
        </div>
        <div>
          <Link href="https://makima.xyz/anime/catalog?sortby=TRENDING_DESC">
            <a className="flex items-center group">
              <Animecard data={herodata} cardid="Trending Now" />
              <span className="ml-2 text-lg group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </Link>
        </div>
        <div>
          <Link href="/popular">
            <a className="flex items-center group">
              <Animecard data={populardata} cardid="All Time Popular" />
              <span className="ml-2 text-lg group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </Link>
        </div>
        <div>
          <div className="lg:flex lg:flex-row justify-between lg:gap-20">
            <VerticalList data={top100data} mobiledata={seasonaldata} id="Top 100 Anime" />
            <VerticalList data={seasonaldata} id="Seasonal Anime" />
          </div>
        </div>
        <div>
          <Link href="https://makima.xyz/anime/catalog?season=SPRING&year=2024">
            <a className="flex items-center group">
              <Animecard data={seasonaldata} cardid="Top Upcoming" />
              <span className="ml-2 text-lg group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
