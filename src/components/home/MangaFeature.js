import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from './MangaFeature.module.css';  // Create a CSS module for styling similar to RecentEpisodes

const MangaFeature = () => {
  const [mangaList, setMangaList] = useState([]);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await axios.get('https://api.mangadex.org/manga');
        setMangaList(response.data.data);
      } catch (error) {
        console.error('Error fetching manga data:', error);
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
        <span className={styles.bar}></span>
        <h1 className={styles.headtitle}>Manga</h1>
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
                <img src={manga.attributes.coverImage} alt={manga.attributes.title.en} />
                <div className={styles.cardtitle}>{manga.attributes.title.en}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MangaFeature;
