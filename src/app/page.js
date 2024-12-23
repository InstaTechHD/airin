// src/app/page.js
"use client";

import Link from 'next/link';
import Animecard from '@/components/CardComponent/Animecards';
import Herosection from '@/components/home/Herosection';
import Navbarcomponent from '@/components/navbar/Navbar';
import { MotionDiv } from '@/utils/MotionDiv';
import VerticalList from '@/components/home/VerticalList';
import ContinueWatching from '@/components/home/ContinueWatching';
import RecentEpisodes from '@/components/home/RecentEpisodes';
import EstimatedSchedule from '@/components/home/EstimatedSchedule'; // Import the new component
import RandomTextComponent from '@/components/RandomTextComponent';
import { getHomePageData, getSession } from './HomeServer'; // Import server functions

export default async function Home() {
  const session = await getSession();
  const { herodata = [], populardata = [], top100data = [], seasonaldata = [] } = await getHomePageData();

  const schedule = [
    { date: 'Monday', activity: 'New Episode of Anime A' },
    { date: 'Wednesday', activity: 'New Episode of Anime B' },
    { date: 'Friday', activity: 'New Episode of Anime C' },
  ];

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
        {/* Add the new Estimated Schedule section */}
        <div>
          <EstimatedSchedule schedule={schedule} />
        </div>
        <div>
          <Link href="https://makima.xyz/anime/catalog?sortby=TRENDING_DESC">
            <Animecard data={herodata} cardid="Trending Now" />
          </Link>
        </div>
        <div>
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
