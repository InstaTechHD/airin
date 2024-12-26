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

  const fetchManga = async (page) => {
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

  useEffect(() => {
    if (id) {
      fetchManga(currentPage);
    }
  }, [id, currentPage]);

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
    <div className={`${styles.mangaRead} dark:bg-gray-900 dark:text-white`}>
      <h1 className="text-3xl font-bold mb-4">{manga.title.english || manga.title.romaji}</h1>
      <img className="mb-4 rounded-lg" src={manga.coverImage.extraLarge} alt={manga.title.english || manga.title.romaji} />
      <p className="mb-6">{manga.description}</p>
      <div className="flex justify-between">
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-500">Previous</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-500">Next</button>
      </div>
    </div>
  );
};

export default MangaRead;
