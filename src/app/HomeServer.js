"use server";

import { TrendingAnilist, PopularAnilist, Top100Anilist, SeasonalAnilist } from "@/lib/Anilistfunctions";
import { redis } from "@/lib/rediscache";
import { getAuthSession } from "./api/auth/[...nextauth]/route";

export async function getHomePageData() {
  try {
    let cachedData = redis ? await redis.get("homepage") : null;

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (!Object.keys(parsedData).length) {
        await redis.del("homepage");
        cachedData = null;
      } else {
        return parsedData;
      }
    }

    const [herodata, populardata, top100data, seasonaldata] = await Promise.all([
      TrendingAnilist(),
      PopularAnilist(),
      Top100Anilist(),
      SeasonalAnilist(),
    ]);

    if (redis) {
      await redis.set(
        "homepage",
        JSON.stringify({ herodata, populardata, top100data, seasonaldata }),
        "EX",
        60 * 60 * 2
      );
    }

    return { herodata, populardata, top100data, seasonaldata };
  } catch (error) {
    console.error("Error fetching homepage from anilist:", error);
    return { herodata: [], populardata: [], top100data: [], seasonaldata: [] };
  }
}

export async function getSession() {
  return getAuthSession();
}
