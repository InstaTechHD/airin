"use server"
import { trending, animeinfo, advancedsearch, top100anime, seasonal, popular, upcoming } from "./anilistqueries";

export const TrendingAnilist = async () => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: trending,
                variables: {
                    page: 1,
                    perPage: 15,
                },
            }),
        }, { next: { revalidate: 3600 } });

        const data = await response.json();
        return data.data.Page.media;
    } catch (error) {
        console.error('Error fetching data from AniList:', error);
    }
}

export const PopularAnilist = async () => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: popular,
                variables: {
                    page: 1,
                    perPage: 15,
                },
            }),
        }, { next: { revalidate: 3600 } });

        const data = await response.json();
        return data.data.Page.media;
    } catch (error) {
        console.error('Error fetching popular data from AniList:', error);
    }
}

export const Top100Anilist = async () => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: top100anime,
                variables: {
                    page: 1,
                    perPage: 10,
                },
            }),
        }, { next: { revalidate: 3600 } });

        const data = await response.json();
        return data.data.Page.media;
    } catch (error) {
        console.error('Error fetching data from AniList:', error);
    }
}

export const SeasonalAnilist = async () => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: seasonal,
                variables: {
                    page: 1,
                    perPage: 10,
                },
            }),
        }, { next: { revalidate: 3600 } });

        const data = await response.json();
        return data.data.Page.media;
    } catch (error) {
        console.error('Error fetching data from AniList:', error);
    }
}

export const AnimeInfoAnilist = async (animeid) => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: animeinfo,
                variables: {
                    id: animeid,
                },
            }),
        }, { next: { revalidate: 3600 } });

        const data = await response.json();
        return data.data.Media;
    } catch (error) {
        console.error('Error fetching data from AniList:', error);
    }
}

export const AdvancedSearch = async (searchvalue, searchType = "ANIME", selectedYear = null, seasonvalue = null, formatvalue = null, genrevalue = [], sortbyvalue = null, currentPage = 1) => {
    const types = {};

    // Correcting how the genre is handled. Genre values need to be passed properly
    if (genrevalue && genrevalue.length > 0) {
        genrevalue.forEach(item => {
            const { type, value } = item;
            if (types[type]) {
                types[type].push(value);
            } else {
                types[type] = [value];
            }
        });
    }

    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: advancedsearch,
                variables: {
                    ...(searchvalue && {
                        search: searchvalue,
                        ...(!sortbyvalue && { sort: "SEARCH_MATCH" }),
                    }),
                    type: searchType.toUpperCase(),
                    ...(selectedYear && { seasonYear: selectedYear }),
                    ...(seasonvalue && { season: seasonvalue }),
                    ...(formatvalue && { format: formatvalue }),
                    ...(sortbyvalue && { sort: sortbyvalue }),
                    ...(Object.keys(types).length > 0 && { genre: types }), // Properly handle genre filter
                    ...(currentPage && { page: currentPage }),
                },
            }),
        });

        const data = await response.json();
        return data.data.Page;

    } catch (error) {
        console.error('Error fetching search data from AniList:', error);
    }
};

export const UpcomingAnilist = async () => {
    try {
        const currentYear = new Date().getFullYear();
        const futureYears = Array.from({ length: 2030 - currentYear + 1 }, (_, i) => currentYear + i);

        const allUpcomingAnime = [];
        for (const year of futureYears) {
            const response = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    query: upcoming,
                    variables: {
                        page: 1,
                        perPage: 15,
                        seasonYear: year,
                    },
                }),
            });

            const data = await response.json();
            allUpcomingAnime.push(...data.data.Page.media);
        }

        return allUpcomingAnime;
    } catch (error) {
        console.error('Error fetching upcoming data from AniList:', error);
        return [];
    }
};
