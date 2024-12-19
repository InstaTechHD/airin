// src/components/FeaturedCard.js
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedCard.module.css'; // Ensure the CSS module is also correct

function FeaturedCard({ item }) {
  return (
    <div className={styles.card}>
      <Link href={`/anime/info/${item.id}`}>
        <div className={styles.cardContent}>
          <div className={styles.cardImageWrapper}>
            <Image
              src={item.coverImage.extraLarge || '/default-image.jpg'}
              alt={item.title || 'Anime cover'}
              width={300}
              height={450}
              className={styles.cardImage}
              placeholder="blur"
              loading="lazy"
            />
          </div>
          <div className={styles.cardInfo}>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardStatus}>{item.status}</p>
            <span className={styles.cardEpisodes}>Episodes: {item.episodes || '?'}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default FeaturedCard;
