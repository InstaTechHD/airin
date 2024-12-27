import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './MangaRead.module.css';

const MangaRead = () => {
  const router = useRouter();
  const { id, chapter } = router.query;
  const [manga, setManga] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (id) {
      const fetchManga = async () => {
        try {
          const response = await axios.post('https://graphql.anilist.co', {
            query: `
              query ($id: Int) {
                Media(id: $id, type: MANGA) {
                  id
                  title {
                    romaji
                    english
                  }
                  description
                  coverImage {
                    extraLarge
                  }
                }
              }
            `,
            variables: { id: parseInt(id, 10) }
          });
          setManga(response.data.data.Media);
        } catch (error) {
          console.error('Error fetching manga data:', error);
        }
      };

      fetchManga();
    }
  }, [id]);

  useEffect(() => {
    if (id && chapter) {
      const fetchChapter = async () => {
        try {
          const response = await axios.get(`https://api.mangadex.org/manga/${id}/feed?translatedLanguage[]=en&limit=1&offset=${chapter - 1}`);
          setChapterData(response.data.data[0]);
        } catch (error) {
          console.error('Error fetching chapter data:', error);
        }
      };

      fetchChapter();
    }
  }, [id, chapter]);

  const handleNextChapter = () => {
    const nextChapter = parseInt(chapter, 10) + 1;
    router.push(`/manga/read/${id}?chapter=${nextChapter}`);
  };

  const handlePreviousChapter = () => {
    const prevChapter = parseInt(chapter, 10) - 1;
    if (prevChapter > 0) {
      router.push(`/manga/read/${id}?chapter=${prevChapter}`);
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
      handleNextChapter();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      handlePreviousChapter();
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!manga) return <div>Error loading manga data.</div>;

  return (
    <div className={styles.mangaRead} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <h1>{manga.title.english || manga.title.romaji}</h1>
      <img src={manga.coverImage.extraLarge} alt={manga.title.english || manga.title.romaji} />
      <p>{manga.description}</p>
      {chapterData && (
        <div>
          <h2>Chapter {chapterData.attributes.chapter}</h2>
          <p>{chapterData.attributes.title}</p>
        </div>
      )}
      <div className={styles.navigationButtons}>
        <button onClick={handlePreviousChapter} disabled={parseInt(chapter, 10) <= 1}>Previous Chapter</button>
        <button onClick={handleNextChapter}>Next Chapter</button>
      </div>
    </div>
  );
};

export default MangaRead;
