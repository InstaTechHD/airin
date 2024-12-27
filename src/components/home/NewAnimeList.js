import React from 'react';
import Animecard from '@/components/CardComponent/Animecards';

function NewAnimeList({ data }) {
  return (
    <div>
      <Animecard data={data} cardid="New Anime Releases" />
    </div>
  );
}

export default NewAnimeList;
