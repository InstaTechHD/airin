import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MangaRead.module.css';

const MangaRead = () => {
  const router = useRouter();
  const { id } = router.query;
  const [manga, setManga] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState([]);
  const [allPagesFetched, setAllPagesFetched] = useState(false);

  const fetchMangaPages = async (page) => {
    try {
      const response = await axios.post('https://graphql.anilist.co', {
        query: `
          query ($id: Int, $page: Int) {
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
              pages(page: $page) {
                id
                page
                imageUrl
              }
            }
          }
        `,
        variables: { id: parseInt(id, 10), page }
      });
      const mangaData = response.data.data.Media;
      setManga(mangaData);
      setTotalPages(mangaData.chapters.length);
      setPages(prevPages => [...prevPages, ...mangaData.pages]);
    } catch (error) {
      console.error('Error fetching manga pages:', error);
    }
  };

  useEffect(() => {
    if (id && !allPagesFetched) {
      fetchMangaPages(currentPage);
    }
  }, [id, currentPage]);

  useEffect(() => {
    if (pages.length === totalPages) {
      setAllPagesFetched(true);
    }
  }, [pages, totalPages]);

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

  const handlePageSelect = (event) => {
    setCurrentPage(parseInt(event.target.value, 10));
  };

  if (!manga) return <div>Loading...</div>;

  return (
    <div className={styles.mangaRead}>
      <h1>{manga.title.english || manga.title.romaji}</h1>
      <img src={manga.coverImage.extraLarge} alt={manga.title.english || manga.title.romaji} />
      <p>{manga.description}</p>
      <div className={styles.pages}>
        {pages.map(page => (
          <img key={page.id} src={page.imageUrl} alt={`Page ${page.page}`} />
        ))}
      </div>
      <div className={styles.navigationButtons}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <select onChange={handlePageSelect} value={currentPage}>
          {Array.from({ length: totalPages }, (_, index) => (
            <option key={index + 1} value={index + 1}>{index + 1}</option>
          ))}
        </select>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default MangaRead;
