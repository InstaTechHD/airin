import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './MangaRead.module.css';

const MangaRead = () => {
  const router = useRouter();
  const { id, chapter } = router.query; // Add chapter to query
  const [manga, setManga] = useState(null);
  const [chapterData, setChapterData] = useState(null); // State to manage chapter data
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
                  chapters {
                    id
                    title
                    description
                  }
                }
              }
            `,
            variables: { id: parseInt(id, 10) }
          });
          setManga(response.data.data.Media);
          // Set initial chapter data
          setChapterData(response.data.data.Media.chapters[0]);
        } catch (error) {
          console.error('Error fetching manga data:', error);
        }
      };

      fetchManga();
    }
  }, [id]);

  const handleNextChapter = () => {
    const nextChapterIndex = chapterData ? chapterData.id + 1 : 1; // Logic for next chapter
    setChapterData(manga.chapters[nextChapterIndex]);
    router.push(`/manga/read/${id}?chapter=${nextChapterIndex}`);
  };

  const handlePreviousChapter = () => {
    const prevChapterIndex = chapterData ? chapterData.id - 1 : 1; // Logic for previous chapter
    if (prevChapterIndex > 0) {
      setChapterData(manga.chapters[prevChapterIndex]);
      router.push(`/manga/read/${id}?chapter=${prevChapterIndex}`);
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
      {chapterData && (
        <div>
          <h2>{chapterData.title}</h2>
          <p>{chapterData.description}</p>
        </div>
      )}
      <div className={styles.navigationButtons}>
        <button onClick={handlePreviousChapter} disabled={!chapterData || chapterData.id <= 1}>Previous Chapter</button>
        <button onClick={handleNextChapter} disabled={!chapterData || chapterData.id >= manga.chapters.length}>Next Chapter</button>
      </div>
    </div>
  );
};

export default MangaRead;
