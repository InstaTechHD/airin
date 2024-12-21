"use server"
import axios from 'axios';
import { ANIME } from "@consumet/extensions";

const gogo = new ANIME.Gogoanime();
const anipahe = new ANIME.Anipahe();
const weebApiBaseUrl = 'https://weebapi.onrender.com';

export async function getGogoSources(id) {
    try {
        const data = await gogo.fetchEpisodeSources(id);
        if (!data) return null;
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getAnipaheSources(id) {
    try {
        const response = await axios.get(`${weebApiBaseUrl}/get_episode/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching anipahe sources:", error);
        return null;
    }
}

export async function getZoroSources(id, provider, episodeid, epnum, subtype) {
    try {
        let data;
        const API = process.env.ZORO_API;
        if (API) {
            const res = await fetch(`${API}/anime/episode-srcs?id=${episodeid}&server=vidstreaming&category=${subtype}`);
            data = await res.json();
        } else {
            console.log(episodeid)
            const resp = await fetch(`https://anify.eltik.cc/sources?providerId=${provider}&watchId=${encodeURIComponent(episodeid)}&episodeNumber=${epnum}&id=${id}&subType=${subtype}`);
            data = await resp.json();
        }
        if (!data) return null;

        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getAnimeSources(id, provider, epid, epnum, subtype) {
    try {
        if (provider === "gogoanime") {
            const data = await getGogoSources(epid);
            return data;
        }
        if (provider === "zoro") {
            const data = await getZoroSources(id, provider, epid, epnum, subtype);
            return data;
        }
        if (provider === "anipahe") {
            const data = await getAnipaheSources(epid);
            return data;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}
