"use server";
import axios from 'axios';
import { ANIME } from "@consumet/extensions";
import { CombineEpisodeMeta } from "@/utils/EpisodeFunctions";
import { redis } from "@/lib/rediscache";
import { getMappings } from "./mappings";

const gogo = new ANIME.Gogoanime();
const zoro = new ANIME.Zoro();
const weebApiBaseUrl = 'https://weebapi.onrender.com';

export async function fetchGogoEpisodes(id) {
  try {
    const data = await gogo.fetchAnimeInfo(id);
    return data?.episodes || [];
  } catch (error) {
    console.error("Error fetching gogoanime:", error.message);
    return [];
  }
}

export async function fetchZoroEpisodes(id) {
  try {
    const data = await zoro.fetchAnimeInfo(id);
    return data?.episodes || [];
  } catch (error) {
    console.error("Error fetching zoro:", error.message);
    return [];
  }
}

export async function fetchAnipaheEpisodes(id) {
  try {
    const response = await axios.get(`${weebApiBaseUrl}/get_full_data/${id}`);
    return response.data.episodes || [];
  } catch (error) {
    console.error("Error fetching anipahe episodes:", error.message);
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
      subEpisodes = await fetchGogoEpisodes(
        mappings.gogoanime.uncensored || mappings.gogoanime.sub || mappings.gogoanime.tv
      );
      dubEpisodes = await fetchGogoEpisodes(mappings.gogoanime.dub);
      if (subEpisodes.length > 0 || dubEpisodes.length > 0) {
        allepisodes.push({
          episodes: { sub: subEpisodes, dub: dubEpisodes },
          providerId: "gogoanime",
          consumet: true,
        });
      }
    }
    if (mappings.zoro && Object.keys(mappings.zoro).length >= 1) {
      subEpisodes = await fetchZoroEpisodes(
        mappings.zoro.uncensored || mappings.zoro.sub || mappings.zoro.tv
      );
      if (subEpisodes.length > 0) {
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
    if (mappings.anipahe && Object.keys(mappings.anipahe).length >= 1) {
      subEpisodes = await fetchAnipaheEpisodes(
        mappings.anipahe.uncensored || mappings.anipahe.sub || mappings.anipahe.tv
      );
      if (subEpisodes.length > 0) {
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

  const cover = await fetchEpisodeMeta(id, !refresh);

  if (redis) {
    if (allepisodes.length > 0) {
      await redis.setex(`episode:${id}`, cacheTime, JSON.stringify(allepisodes));
    }
    let data = allepisodes;
    if (refresh) {
      if (cover.length > 0) {
        await redis.setex(`meta:${id}`, cacheTime, JSON.stringify(cover));
        data = await CombineEpisodeMeta(allepisodes, cover);
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

function transformEpisodeId(episodeId) {
  const regex = /^([^$]*)\$episode\$([^$]*)/;
  const match = episodeId.match(regex);
  if (match && match[1] && match[2]) {
    return `${match[1]}?ep=${match[2]}`;
  }
  return episodeId;
}
