"use client";

import React from "react";
import NextAiringDate from "@/components/videoplayer/NextAiringDate";
import PlayerAnimeCard from "@/components/videoplayer/PlayerAnimeCard";
import PlayerComponent from "@/components/videoplayer/PlayerComponent";
import Animecards from "@/components/CardComponent/Animecards";
import CommentSection from "@/components/CommentSection"; // Import the updated component

const AnimeWatchClient = ({ id, epId, provider, epNum, data, subdub, session, savedep, comments }) => {
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row lg:max-w-[98%] mx-auto xl:max-w-[94%] lg:gap-[6px] mt-[70px]">
        <div className="flex-grow w-full h-full">
          <PlayerComponent id={id} epId={epId} provider={provider} epNum={epNum} data={data} subdub={subdub} session={session} savedep={savedep} />
          {data?.status === 'RELEASING' &&
            <NextAiringDate nextAiringEpisode={data?.nextAiringEpisode} />
          }
          {/* Comment section */}
          <CommentSection animeId={id} episodeNumber={epNum} session={session} />
        </div>
        <div className="h-full lg:flex lg:flex-col md:max-lg:w-full gap-10">
          <div className="rounded-lg hidden lg:block lg:max-w-[280px] xl:max-w-[380px] w-[100%] xl:overflow-y-scroll xl:overflow-x-hidden overflow-hidden scrollbar-hide overflow-y-hidden">
            <PlayerAnimeCard data={data?.relations?.edges} id="Related Anime" />
          </div>
          <div className="rounded-lg hidden lg:block lg:max-w-[280px] xl:max-w-[380px] w-[100%] xl:overflow-y-scroll xl:overflow-x-hidden overflow-hidden scrollbar-hide overflow-y-hidden">
            <PlayerAnimeCard data={data?.recommendations?.nodes} id="Recommendations" />
          </div>
        </div>
        <div className="lg:hidden">
          <Animecards data={data?.relations?.edges} cardid="Related Anime" />
        </div>
        <div className="lg:hidden">
          <Animecards data={data?.recommendations?.nodes} cardid={"Recommendations"} />
        </div>
      </div>
    </>
  );
};

export default AnimeWatchClient;
