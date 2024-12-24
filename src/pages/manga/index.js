import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from './Manga.module.css';

const MangaPage = () => {
  const [mangaList, setMangaList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await axios.post('https://graphql.anilist.co', {
          query: `
            query ($page: Int) {
              Page(page: $page, perPage: 50) {
                pageInfo {
                  total
                  currentPage
                  lastPage
                  hasNextPage
                }
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
          variables: { page }
        });
        const data = await response.json();
        setMangaList(data.data.Page.media);
        setTotalPages(data.data.Page.pageInfo.lastPage);
      } catch (error) {
        console.error('Error fetching manga data from AniList:', error);
      }
    };

    fetchManga();
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNextPage();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      handlePreviousPage();
    }
  };

  return (
    <div className={styles.mangaPage} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <h1>All Manga</h1>
      <div className={styles.mangaGrid}>
        {mangaList.map(manga => (
          <Link href={`/manga/read/${manga.id}`} key={manga.id}>
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
