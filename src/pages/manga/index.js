import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from './Manga.module.css';

const MangaPage = () => {
  const [mangaList, setMangaList] = useState([]);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await axios.get('https://graphql.anilist.co', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: `
              {
                Page(page: 1, perPage: 50) {
                  media(type: MANGA, sort: POPULARITY_DESC) {
                    id
                    title {
                      romaji
                      english
                    }
                    coverImage {
                      extraLarge
                    }
                  }
                }
              }
            `,
          }),
        });
        const data = await response.json();
        setMangaList(data.data.Page.media);
      } catch (error) {
        console.error('Error fetching manga data from AniList:', error);
      }
    };

    fetchManga();
  }, []);

  return (
    <div className={styles.mangaPage}>
      <h1>All Manga</h1>
      <div className={styles.mangaGrid}>
        {mangaList.map(manga => (
          <Link href={`/manga/info/${manga.id}`} key={manga.id}>
            <div className={styles.mangaCard}>
              <img src={manga.coverImage.extraLarge} alt={manga.title.english || manga.title.romaji} />
              <div className={styles.mangaTitle}>{manga.title.english || manga.title.romaji}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MangaPage;
