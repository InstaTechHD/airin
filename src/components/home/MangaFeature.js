import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from './MangaFeature.module.css';

const MangaFeature = () => {
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
                Media(type: MANGA, sort: POPULARITY_DESC) {
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
            `,
          }),
        });
        const data = await response.json();
        setMangaList(data.data.Media);
      } catch (error) {
        console.error('Error fetching manga data from AniList:', error);
      }
    };

    fetchManga();
  }, []);

  const scrollLeft = () => {
    // Implement scrolling logic
  };

  const scrollRight = () => {
    // Implement scrolling logic
  };

  return (
    <div className={styles.animecard}>
      <div className={styles.cardhead}>
        <Link href="/manga">
          <span className={styles.bar}></span>
          <h1 className={styles.headtitle}>Manga</h1>
        </Link>
      </div>
      <div className={styles.animeitems}>
        <span className={styles.leftarrow} onClick={scrollLeft}>
          {/* SVG for left arrow */}
        </span>
        <span className={styles.rightarrow} onClick={scrollRight}>
          {/* SVG for right arrow */}
        </span>
        <div className={styles.cardcontainer}>
          {mangaList.map(manga => (
            <Link href={`/manga/info/${manga.id}`} key={manga.id}>
              <div className={styles.carditem}>
                <img src={manga.coverImage.extraLarge} alt={manga.title.english || manga.title.romaji} />
                <div className={styles.cardtitle}>{manga.title.english || manga.title.romaji}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MangaFeature;
