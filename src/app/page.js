"use server";

import Animecard from '@/components/CardComponent/Animecards';
import Herosection from '@/components/home/Herosection';
import Navbarcomponent from '@/components/navbar/Navbar';
import { TrendingAnilist, PopularAnilist, Top100Anilist, SeasonalAnilist } from '@/lib/Anilistfunctions';
import React from 'react';
import Link from 'next/link';
import VerticalList from '@/components/home/VerticalList';
import ContinueWatching from '@/components/home/ContinueWatching';
import RecentEpisodes from '@/components/home/RecentEpisodes';
import { getAuthSession } from './api/auth/[...nextauth]/route';
import { redis } from '@/lib/rediscache';
import RandomTextComponent from '@/components/RandomTextComponent';

import styles from '@/styles/Animecard.module.css';

async function getHomePage() {
  let cachedData;
  if (redis) {
    cachedData = await redis.get(`homepage`);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (Object.keys(parsedData).length === 0) { // Check if data is empty
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
      SeasonalAnilist(),
    ]);
    const cacheTime = 60 * 60 * 2;
    if (redis) {
      await redis.set(`homepage`, JSON.stringify({ herodata, populardata, top100data, seasonaldata }), "EX", cacheTime);
    }
    return { herodata, populardata, top100data, seasonaldata };
  }
}

async function Home() {
  const session = await getAuthSession();
  const { herodata, populardata, top100data, seasonaldata } = await getHomePage();

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
          <Link href="https://makima.xyz/anime/catalog?sortby=TRENDING_DESC">
            <div className={styles.animecard}>
              <div className={styles.cardhead}>
                <div className={styles.bar}></div>
                <h2 className={styles.headtitle}>Trending Now</h2>
              </div>
              <div className={styles.animeitems}>
                <div className={styles.leftarrow}>
                  {/* Arrow content */}
                </div>
                <div className={styles.cardcontainer}>
                  {herodata.map((anime, index) => (
                    <div key={index} className={styles.carditem}>
                      <div className={styles.cardimgcontainer}>
                        <img src={anime.imageUrl} alt={anime.title} className={styles.cardimage} />
                      </div>
                      <div className={styles.cardtitle}>{anime.title}</div>
                    </div>
                  ))}
                </div>
                <div className={styles.rightarrow}>
                  {/* Arrow content */}
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div>
          <Link href="https://makima.xyz/anime/catalog?sortby=">
            <div className={styles.animecard}>
              <div className={styles.cardhead}>
                <div className={styles.bar}></div>
                <h2 className={styles.headtitle}>All Time Popular</h2>
              </div>
              <div className={styles.animeitems}>
                <div className={styles.leftarrow}>
                  {/* Arrow content */}
                </div>
                <div className={styles.cardcontainer}>
                  {populardata.map((anime, index) => (
                    <div key={index} className={styles.carditem}>
                      <div className={styles.cardimgcontainer}>
                        <img src={anime.imageUrl} alt={anime.title} className={styles.cardimage} />
                      </div>
                      <div className={styles.cardtitle}>{anime.title}</div>
                    </div>
                  ))}
                </div>
                <div className={styles.rightarrow}>
                  {/* Arrow content */}
                </div>
              </div>
            </div>
          </Link>
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
