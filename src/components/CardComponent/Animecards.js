"use client"
import React, { useRef, useState } from 'react';
import styles from '../../styles/Animecard.module.css';
import { useDraggable } from 'react-use-draggable-scroll';
import Link from 'next/link';
import ItemContent from './ItemContent';

function Animecards({ data, cardid, show=true, type="anime" }) {
  const containerRef = useRef();
  const { events } = useDraggable(containerRef);
  const [isLeftArrowActive, setIsLeftArrowActive] = useState(false);
  const [isRightArrowActive, setIsRightArrowActive] = useState(false);

  function handleScroll() {
    const container = containerRef.current;
    const scrollPosition = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    setIsLeftArrowActive(scrollPosition > 30);
    setIsRightArrowActive(scrollPosition < maxScroll - 30);
  }

  const smoothScroll = (amount) => {
    const container = containerRef.current;
    const cont = document.getElementById(cardid);

    if (cont && container) {
      cont.classList.add('scroll-smooth');
      container.scrollLeft += amount;

      setTimeout(() => {
        cont.classList.remove('scroll-smooth');
      }, 300);
    }
  };

  function scrollLeft() {
    smoothScroll(-500);
  }

  function scrollRight() {
    smoothScroll(+500);
  }

  return (
    <div className={styles.animecard}>
      {show && (
        <div className={styles.cardhead}>
          <span className={styles.bar}></span>
          <h1 className={styles.headtitle}>{cardid}</h1>
        </div>
      )}
      <div className={styles.animeitems}>
        <span className={`${styles.leftarrow} ${isLeftArrowActive ? styles.active : styles.notactive}`}>
          <svg onClick={scrollLeft} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </span>
        <span className={`${styles.rightarrow} ${isRightArrowActive ? styles.active : styles.notactive}`}>
          <svg onClick={scrollRight} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
        <div className={styles.cardcontainer} id={cardid} {...events} ref={containerRef} onScroll={handleScroll}>
          {data?.map((item) => {
            const media = {
              id: item.id || '',
              coverImage: item?.coverImage?.extraLarge || item?.coverImage?.large || '',
              title: item.title || '',
              status: item.status || '',
              format: item.format || '',
              episodes: item?.episodes || '',
              chapters: item?.chapters || '',
              nextAiringEpisode: item?.nextAiringEpisode || '',
            };
            return (
              <Link href={`/${media.format === 'MANGA' || media.format === 'NOVEL' ? 'manga/read' : 'anime/info'}/${media.id}`} key={media.id}>
                <ItemContent anime={media} cardid={cardid} />
              </Link>
            );
          })}
          {!data?.length && (
            Array.from({ length: 15 }, (_, index) => (
              <div key={index} className={`${styles.carditem} ${styles.loading}`}>
                <div
                  className={`${styles.cardimgcontainer} ${styles.pulse}`}
                  style={{ animationDelay: `${(index + 2) * 0.3}s` }}
                ></div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Animecards;
