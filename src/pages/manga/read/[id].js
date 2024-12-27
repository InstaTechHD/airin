import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './MangaRead.module.css';

const MangaRead = () => {
  const router = useRouter();
  const { id } = router.query;
  const [manga, setManga] = useState(null);
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

  const handleNextChapter = () => {
    const nextId = parseInt(id, 10) + 1; // Assuming next chapter has the next numerical ID
    router.push(`/manga/read/${nextId}`);
  };

  const handlePreviousChapter = () => {
    const prevId = parseInt(id, 10) - 1; // Assuming previous chapter has the previous numerical ID
    if (prevId > 0) {
      router.push(`/manga/read/${prevId}`);
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

  if (!manga) return <div>Loading...</div>;

  return (
    <div className={styles.mangaRead} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <h1>{manga.title.english || manga.title.romaji}</h1>
      <img src={manga.coverImage.extraLarge} alt={manga.title.english || manga.title.romaji} />
      <p>{manga.description}</p>
      <div className={styles.navigationButtons}>
        <button onClick={handlePreviousChapter} disabled={parseInt(id, 10) <= 1}>Previous Chapter</button>
        <button onClick={handleNextChapter}>Next Chapter</button>
      </div>
    </div>
  );
};

export default MangaRead;
