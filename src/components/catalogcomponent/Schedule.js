import React, { useState, useEffect } from 'react';
import styles from '../../styles/Catalog.module.css';

async function fetchSchedule() {
    const query = `
        query {
            Page {
                airingSchedules(perPage: 7, sort: TIME) {
                    nodes {
                        airingAt
                        episode
                        media {
                            title {
                                romaji
                            }
                            coverImage {
                                large
                            }
                        }
                    }
                }
            }
        }
    `;

    const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
        }),
    });
    const data = await response.json();
    return data.data.Page.airingSchedules.nodes;
}

function Schedule() {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        fetchSchedule().then(setSchedule);
    }, []);

    return (
        <div className={styles.schedule}>
            <h2 className={styles.scheduleTitle}>Anime Schedule</h2>
            <div className={styles.scheduleContainer}>
                {schedule.map((item, index) => (
                    <div key={index} className={styles.scheduleItem}>
                        <img
                            src={item.media.coverImage.large}
                            alt={item.media.title.romaji}
                            className={styles.coverImage}
                        />
                        <div className={styles.scheduleInfo}>
                            <h3 className={styles.animeTitle}>{item.media.title.romaji}</h3>
                            <p className={styles.episode}>Episode {item.episode}</p>
                            <p className={styles.airingAt}>
                                Airing at: {new Date(item.airingAt * 1000).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Schedule;
