const anipahe = new ANIME.Anipahe();

export async function fetchAnipaheEpisodes(id) {
  try {
    const data = await anipahe.fetchAnimeInfo(id);

    return data?.episodes || [];
  } catch (error) {
    console.error("Error fetching anipahe:", error.message);
    return [];
  }
}

const fetchAndCacheData = async (id, meta, redis, cacheTime, refresh) => {
  let mappings;
  let subEpisodes = [];
  let dubEpisodes = [];
  let allepisodes = [];

  if (id) {
    mappings = await getMappings(id);
  }

  if (mappings) {
    if (mappings.gogoanime && Object.keys(mappings.gogoanime).length >= 1) {
      // Fetch sub episodes if available
      if (
        mappings?.gogoanime?.uncensored ||
        mappings?.gogoanime?.sub ||
        mappings?.gogoanime?.tv
      ) {
        subEpisodes = await fetchGogoEpisodes(
          mappings?.gogoanime?.uncensored ||
            mappings.gogoanime.sub ||
            mappings?.gogoanime?.tv
        );
      }

      // Fetch dub episodes if available
      if (mappings?.gogoanime?.dub) {
        dubEpisodes = await fetchGogoEpisodes(mappings?.gogoanime?.dub);
      }

      if (subEpisodes?.length > 0 || dubEpisodes?.length > 0) {
        allepisodes.push({
          episodes: { sub: subEpisodes, dub: dubEpisodes },
          providerId: "gogoanime",
          consumet: true,
        });
      }
    }
    if (mappings?.zoro && Object.keys(mappings.zoro).length >= 1) {
      let subEpisodes = [];

      // Fetch sub episodes if available
      if (
        mappings?.zoro?.uncensored ||
        mappings?.zoro?.sub ||
        mappings?.zoro?.tv
      ) {
        subEpisodes = await fetchZoroEpisodes(
          mappings?.zoro?.uncensored
            ? mappings?.zoro?.uncensored
            : mappings.zoro.sub
        );
      }
      if (subEpisodes?.length > 0) {
        const transformedEpisodes = subEpisodes.map(episode => ({
          ...episode,
          id: transformEpisodeId(episode.id)
        }));
      
        allepisodes.push({
          episodes: transformedEpisodes,
          providerId: "zoro",
        });
      }
    }
    if (mappings?.anipahe && Object.keys(mappings.anipahe).length >= 1) {
      let subEpisodes = [];

      // Fetch sub episodes if available
      if (
        mappings?.anipahe?.uncensored ||
        mappings?.anipahe?.sub ||
        mappings?.anipahe?.tv
      ) {
        subEpisodes = await fetchAnipaheEpisodes(
          mappings?.anipahe?.uncensored
            ? mappings?.anipahe?.uncensored
            : mappings.anipahe.sub
        );
      }
      if (subEpisodes?.length > 0) {
        const transformedEpisodes = subEpisodes.map(episode => ({
          ...episode,
          id: transformEpisodeId(episode.id)
        }));
      
        allepisodes.push({
          episodes: transformedEpisodes,
          providerId: "anipahe",
        });
      }
    }
  } 
  const cover = await fetchEpisodeMeta(id, !refresh)

  // Check if redis is available
  if (redis) {
    if (allepisodes) {
      await redis.setex(
        `episode:${id}`,
        cacheTime,
        JSON.stringify(allepisodes)
      );
    }

    let data = allepisodes;
    if (refresh) {
      if (cover && cover?.length > 0) {
        try {
          await redis.setex(`meta:${id}`, cacheTime, JSON.stringify(cover));
          data = await CombineEpisodeMeta(allepisodes, cover);
        } catch (error) {
          console.error("Error serializing cover:", error.message);
        }
      } else if (meta) {
        data = await CombineEpisodeMeta(allepisodes, JSON.parse(meta));
      }
    } else if (meta) {
      data = await CombineEpisodeMeta(allepisodes, JSON.parse(meta));
    }

    return data;
  } else {
    console.error("Redis URL not provided. Caching not possible.");
    return allepisodes;
  }
};
