import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MangaRead.module.css';

const MangaRead = () => {
  const router = useRouter();
  const { id } = router.query;
  const [manga, setManga] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
    // Logic to fetch and display the next page of manga
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
      // Logic to fetch and display the previous page of manga
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
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default MangaRead;
