"use client"
"use strict"; // Add strict mode

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../../styles/PlayAnimeCard.module.css';
import Link from 'next/link';
import { useTitle } from '../../lib/store';
import { useStore } from "zustand";

function PlayerAnimeCard({ data, id }) {
  const animetitle = useStore(useTitle, (state) => state.animetitle);
  const [visibleItems, setVisibleItems] = useState(4);
  const episodesIcon = <svg viewBox="0 0 32 32" className="w-[18px] h-[18px] mr-1" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M16 0C7.164 0 0 7.164 0 16s7.164 16 16 16 16-7.164 16-16S24.836 0 16 0zm0 29.091c-7.216 0-13.091-5.875-13.091-13.091S8.784 2.909 16 2.909 29.091 8.784 29.091 16 23.216 29.091 16 29.091z" fill="currentColor"/><path d="M11.636 22.182l-1.818-1.818 7.091-7.091V5.818h2.545v8.727l-8.818 8.818z" fill="currentColor"/></svg>;

  useEffect(() => {
    if (id === 'Recommendations') {
      setVisibleItems(15);
    }
  }, [data]);

  const handleShowMore = () => {
    setVisibleItems(data.length);
  };

  const handleShowLess = () => {
    setVisibleItems(4);
  };

  return (
    <>
      <div className='px-[10px] mb-[8px] mx-0 mt-0 leading-tight lg:px-[2px] lg:mx-2 flex items-center gap-2'>
        <span className="h-6 md:h-8 rounded-md w-[.35rem] md:w-[.3rem] bg-white "></span>
        <h2 className=" lg:text-[22px] text-[21px]">{id}</h2>
      </div>
      <div className={styles.playanimecard}>
        {data && data?.slice(0, visibleItems).map((item) => {
          const nodeId = item?.node?.id || item?.mediaRecommendation?.id;
          const coverImage = item?.node?.coverImage?.large || item?.mediaRecommendation?.coverImage?.extraLarge;
          const title = item?.node?.title?.[animetitle] || item?.mediaRecommendation?.title?.[animetitle] || item?.node?.title?.romaji || item?.mediaRecommendation?.title?.romaji;
          const format = item?.node?.format?.toLowerCase() || item?.mediaRecommendation?.format?.toLowerCase();

          return (
            <div className={styles.playcarditem} key={nodeId}>
              <div className={styles.playcardimgcon}>
                {format === 'manga' || format === 'novel' ? (
                  <Image
                    src={coverImage}
                    width={70}
                    height={90}
                    alt='image'
                    className={styles.playcardimg}
                  />
                ) : (
                  <Link href={`/anime/info/${nodeId}`}>
                    <Image
                      src={coverImage}
                      width={70}
                      height={90}
                      alt='image'
                      className={styles.playcardimg}
                    />              
                  </Link>
                )}
              </div>
              <div className={styles.playcardinfo}>
                <p className={styles.playcardrelation}>{item?.relationType}</p>
                {format === 'manga' || format === 'novel' ? (
                  <span className={styles.playcardtitle}>{title}</span>
                ) : (
                  <Link href={`/anime/info/${nodeId}`}>
                    <p className={styles.playcardtitle}>{title}</p>
                  </Link>
                )}
                <p className={styles.playepnum}>
                  {item?.node?.format || item?.mediaRecommendation?.format} <span>.</span>
                  {item?.node ? (
                    item?.node?.episodes && (
                      <>
                        {episodesIcon}
                        {item?.node?.episodes}
                      </>
                    ) ||
                    (item?.node?.chapters && `${item?.node?.chapters} CH`) ||
                    '?'
                  ) : (
                    item?.mediaRecommendation?.episodes !== undefined && (
                      <>
                        {episodesIcon}
                        {item?.mediaRecommendation?.episodes}
                      </>
                    )
                  )}
                  <span>.</span> {item?.node?.status || item?.mediaRecommendation?.status || ''}
                </p>
              </div>
            </div>
          );
        })}

        {id !== 'Recommendations' && data.length > visibleItems && (
          <div className={styles.showButton} onClick={handleShowMore}>
            Show More
          </div>
        )}

        {id !== 'Recommendations' && visibleItems > 5 && (
          <div className={styles.showButton} onClick={handleShowLess}>
            Show Less
          </div>
        )}
      </div>
    </>
  );
}

export default PlayerAnimeCard;
