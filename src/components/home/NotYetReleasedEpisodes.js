import React from 'react';
import Animecard from '@/components/CardComponent/Animecards';

function NotYetReleasedEpisodes({ data }) {
  return (
    <div>
      <Animecard data={data} cardid="Upcoming Releases" />
    </div>
  );
}

export default NotYetReleasedEpisodes;
