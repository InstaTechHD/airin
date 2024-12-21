const anipahe = new ANIME.Anipahe();

async function mapAnipahe(title) {
    let eng = await anipahe.search(title?.english || title?.romaji || title?.userPreferred);
    const anipahemap = findSimilarTitles(title?.english, eng?.results);
    const combined = [...anipahemap];

    const uniqueCombined = combined.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);

    uniqueCombined.sort((a, b) => b.similarity - a.similarity);

    const anipahe = {};

    uniqueCombined.forEach((obj) => {
        const title = obj.title;
        const id = obj.id;

        const match = title.replace(/\(TV\)/g, "").match(/\(([^)0-9]+)\)/);
        if (match && (match[1].toLowerCase() === 'uncensored' || match[1].toLowerCase() === 'dub')) {
            const key = match[1].replace(/\s+/g, '-').toLowerCase();
            if (!anipahe[key]) {
                anipahe[key] = id;
            }
        } else {
            if (!anipahe['sub']) {
                anipahe['sub'] = id;
            }
        }
    });
    return anipahe;
}

export async function getMappings(anilistId) {
    const data = await getInfo(anilistId);
    let gogores, zorores, anipaheRes;
    if (!data) {
        return null;
    }
    gogores = await mapGogo(data?.title);
    zorores = await mapZoro(data?.title);
    anipaheRes = await mapAnipahe(data?.title);
    return { gogoanime: gogores, zoro: zorores, anipahe: anipaheRes, id: data?.id, malId: data?.idMal, title: data?.title.romaji };
}
