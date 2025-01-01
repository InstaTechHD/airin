"use client";
import React, { useState, useEffect } from 'react';
import Episodesection from '@/components/Episodesection';
import AnimeDetailsTop from '@/components/details/AnimeDetailsTop';
import AnimeDetailsBottom from '@/components/details/AnimeDetailsBottom';
import Animecards from '@/components/CardComponent/Animecards';
import { getUserLists } from '@/lib/AnilistUser';
import { createWatch2GetherRoom } from '@/lib/Watch2Gether'; // Adjust the import path as needed

function DetailsContainer({ data, id, session, type }) {
  const [list, setList] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const fetchlist = async () => {
      const data = await getUserLists(session?.user?.token, id);
      setList(data);
    };
    fetchlist();
  }, []);

  const handleCreateRoom = async () => {
    try {
      const room = await createWatch2GetherRoom(id, data?.nextAiringEpisode?.episode || 1);
      if (room?.url) {
        window.open(room.url, '_blank');
      } else {
        alert('Failed to create Watch2Gether room. Please try again later.');
      }
    } catch (error) {
      console.error('Error creating Watch2Gether room:', error);
      alert('An error occurred while creating the Watch2Gether room.');
    }
  };

  const progress = list !== null ? (list?.status === 'COMPLETED' ? 0 : list?.progress) : 0;

  return (
    <>
      <div className="h-[500px] ">
        <AnimeDetailsTop data={data} list={list} session={session} setList={setList} url={url} />
      </div>
      <AnimeDetailsBottom data={data} />
      <Episodesection data={data} id={id} setUrl={setUrl} progress={progress} />
      <div className="watch2gether-button">
        <button onClick={handleCreateRoom}>Watch Together</button>
      </div>
      {data?.recommendations?.nodes?.length > 0 && (
        <div className="recommendationglobal">
          <Animecards data={data.recommendations.nodes} cardid={"Recommendations"} type={type} />
        </div>
      )}
    </>
  );
}

export default DetailsContainer;
