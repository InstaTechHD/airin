import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MangaRead.module.css';

const MangaRead = () => {
  const router = useRouter();
  const { id } = router.query;
  const [manga, setManga] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Set a default value for total pages

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
                  chapters
                }
              }
            `,
            variables: { id: parseInt(id, 10) }
          });
          const mangaData = response.data.data.Media;
          setManga(mangaData);
          setTotalPages(mangaData.chapters.length); // Assuming chapters is an array
        } catch (error) {
          console.error('Error fetching manga data:', error);
        }
      };

      fetchManga();
    }
  }, [id]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  if (!manga) return <div>Loading...</div>;

  return (
    <div className={styles.mangaRead}>
      <h1>{manga.title.english || manga.title.romaji}</h1>
      <img src={manga.coverImage.extraLarge} alt={manga.title.english || manga.title.romaji} />
      <p>{manga.description}</p>
      <div className={styles.navigationButtons}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default MangaRead;
