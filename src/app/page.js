"use server"
import Animecard from '@/components/CardComponent/Animecards'
import Herosection from '@/components/home/Herosection'
import Navbarcomponent from '@/components/navbar/Navbar'
import { TrendingAnilist, PopularAnilist, Top100Anilist, SeasonalAnilist } from '@/lib/Anilistfunctions'
import React, { useEffect, useState } from 'react'
import { MotionDiv } from '@/utils/MotionDiv'
import VerticalList from '@/components/home/VerticalList'
import ContinueWatching from '@/components/home/ContinueWatching'
import RecentEpisodes from '@/components/home/RecentEpisodes'
import { getAuthSession } from './api/auth/[...nextauth]/route'
import { redis } from '@/lib/rediscache'
import RandomTextComponent from '@/components/RandomTextComponent';
import axios from 'axios';

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

const fetchMangaData = async (type) => {
  try {
    const response = await axios.post('https://graphql.anilist.co', {
      query: `
        query {
          Page(page: 1, perPage: 10) {
            media(type: MANGA, sort: ${type}) {
              id
              title {
                romaji
                english
              }
              coverImage {
                extraLarge
              }
            }
          }
        }
      `
    });
    return response.data.data.Page.media;
  } catch (error) {
    console.error(`Error fetching ${type.toLowerCase()} manga:`, error);
    return [];
  }
};

async function Home() {
  const session = await getAuthSession();
  const { herodata = [], populardata = [], top100data = [], seasonaldata = [] } = await getHomePage();
  const [trendingManga, setTrendingManga] = useState([]);
  const [popularManga, setPopularManga] = useState([]);

  useEffect(() => {
    const fetchManga = async () => {
      setTrendingManga(await fetchMangaData('TRENDING_DESC'));
      setPopularManga(await fetchMangaData('POPULARITY_DESC'));
    };
    fetchManga();
  }, []);

  const renderMangaCard = (data, cardid) => (
    <Animecard data={data} cardid={cardid} type="manga"/>
  );

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
          {renderMangaCard(herodata, "Trending Now")}
        </div>
        <div>
          {renderMangaCard(populardata, "All Time Popular")}
        </div>
        <div>
          <div className='lg:flex lg:flex-row justify-between lg:gap-20'>
            <VerticalList data={top100data} mobiledata={seasonaldata} id="Top 100 Anime" />
            <VerticalList data={seasonaldata} id="Seasonal Anime" />
          </div>
        </div>
        <div>
          {renderMangaCard(trendingManga, "Trending Manga")}
        </div>
        <div>
          {renderMangaCard(popularManga, "Popular Manga")}
        </div>
      </div>
    </div>
  )
}

export default Home
