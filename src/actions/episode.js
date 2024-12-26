"use server";
import { ANIME } from "@consumet/extensions";
import { CombineEpisodeMeta } from "@/utils/EpisodeFunctions";
import { redis } from "@/lib/rediscache";
import { getMappings } from "./mappings";

const gogo = new ANIME.Gogoanime();
const hianime = new ANIME.Hianime(); // Corrected initialization

export async function fetchGogoEpisodes(id) {
  try {
    const data = await gogo.fetchAnimeInfo(id);
    return data?.episodes || [];
  } catch (error) {
    console.error("Error fetching gogoanime:", error.message);
    return [];
  }
}

export async function fetchHianimeEpisodes(id) { // Add Hianime function
  try {
    const data = await hianime.fetchAnimeInfo(id);
    return data?.episodes || [];
  } catch (error) {
    console.error("Error fetching hianime:", error.message);
    return [];
  }
}

async function fetchEpisodeMeta(id, available = false) {
  try {
    if (available) {
      return null;
    }
    const res = await fetch(
      `https://aniwatch-api-flax.vercel.app/api/v2/hianime/anime/${id}`
    );
    const data = await res.json();
    const episodesArray = Object.values(data?.episodes);

    if (!episodesArray) {
      return [];
    }
    return episodesArray;
  } catch (error) {
    console.error("Error fetching and processing meta:", error.message);
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
    if (mappings.hianime && Object.keys(mappings.hianime).length >= 1) { // Add Hianime mapping
      let subEpisodes = [];

      if (
        mappings?.hianime?.uncensored ||
        mappings?.hianime?.sub ||
        mappings?.hianime?.tv
      ) {
        subEpisodes = await fetchHianimeEpisodes(
          mappings?.hianime?.uncensored
            ? mappings?.hianime?.uncensored
            : mappings.hianime.sub
        );
      }
      if (subEpisodes?.length > 0) {
        const transformedEpisodes = subEpisodes.map(episode => ({
          ...episode,
          id: transformEpisodeId(episode.id)
        }));

        allepisodes.push({
          episodes: transformedEpisodes,
          providerId: "hianime",
        });
      }
    }
  }
  const cover = await fetchEpisodeMeta(id, !refresh);

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

export const getEpisodes = async (id, status, refresh = false) => {
  let cacheTime = null;
  if (status) {
    cacheTime = 60 * 60 * 3;
  } else {
    cacheTime = 60 * 60 * 24 * 45;
  }

  let meta = null;
  let cached;

  if (redis) {
    try {
      meta = await redis.get(`meta:${id}`);
      if (JSON.parse(meta)?.length === 0) {
        await redis.del(`meta:${id}`);
        console.log("deleted meta cache");
        meta = null;
      }
      cached = await redis.get(`episode:${id}`);
      if (JSON.parse(cached)?.length === 0) {
        await redis.del(`episode:${id}`);
        cached = null;
      }
      let data;
      if (refresh) {
        data = await fetchAndCacheData(id, meta, redis, cacheTime, refresh);
      }
      if (data?.length > 0) {
        console.log("deleted cache");
        return data;
      }

      console.log("using redis");
    } catch (error) {
      console.error("Error checking Redis cache:", error.message);
    }
  }

  if (cached) {
    try {
      let cachedData = JSON.parse(cached);
      if (meta) {
        cachedData = await CombineEpisodeMeta(cachedData, JSON.parse(meta));
      }
      return cachedData;
    } catch (error) {
      console.error("Error parsing cached data:", error.message);
    }
  } else {
    const fetchdata = await fetchAndCacheData(
      id,
      meta,
      redis,
      cacheTime,
      !refresh
    );
    return fetchdata;
  }
};

function transformEpisodeId(episodeId) {
  const regex = /^([^$]*)\$episode\$([^$]*)/;
  const match = episodeId.match(regex);

  if (match && match[1] && match[2]) {
    return `${match[1]}?ep=${match[2]}`;
  }
  return episodeId;
}
