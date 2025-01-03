import React, { useState, useEffect } from 'react';
import styles from '../../styles/Catalog.module.css'; // Assuming you have this CSS file

async function fetchJikanSchedule() {
    try {
        const response = await fetch('https://api.jikan.moe/v4/schedules');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching schedule from Jikan:', error.message);
        throw error;
    }
}

async function fetchAniListDetails(title) {
    const query = `
        query ($title: String) {
            Media(search: $title, type: ANIME) {
                id
                title {
                    romaji
                }
                coverImage {
                    large
                }
            }
        }
    `;
    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: { title: title },
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.data.Media;
    } catch (error) {
        console.error('Error fetching details from AniList:', error.message);
        throw error;
    }
}

function Schedule() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const jikanSchedule = await fetchJikanSchedule();
                const enrichedSchedule = await Promise.all(
                    jikanSchedule.map(async (item) => {
                        const aniListDetails = await fetchAniListDetails(item.title);
                        return {
                            ...item,
                            aniListId: aniListDetails.id,
                            aniListTitle: aniListDetails.title.romaji,
                            aniListCoverImage: aniListDetails.coverImage.large,
                        };
                    })
                );
                setSchedule(enrichedSchedule);
                setLoading(false);
            } catch (error) {
                console.error('Error in fetchData:', error.message);
                setError(error);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const getTimeRemaining = (airingAt) => {
        const total = new Date(airingAt).getTime() - Date.now();
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));

        return {
            total,
            days,
            hours,
            minutes,
            seconds
        };
    };

    if (loading) {
        return <div className={styles.schedule}>Loading schedule...</div>;
    }

    if (error) {
        return <div className={styles.schedule}>Error loading schedule: {error.message}</div>;
    }

    return (
        <div className={styles.schedule}>
            <h2 className={styles.scheduleTitle}>Anime Schedule</h2>
            <div className={styles.scheduleContainer}>
                {schedule.map((item, index) => {
                    const timeRemaining = getTimeRemaining(item.aired.from);
                    return (
                        <a
                            key={index}
                            href={`https://anilist.co/anime/${item.aniListId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.scheduleItem}
                        >
                            <div className={styles.scheduleInfo}>
                                <h3 className={styles.animeTitle}>{item.aniListTitle || item.title}</h3>
                                <p className={styles.airingAt}>
                                    Airing at: {new Date(item.aired.from).toLocaleString()}
                                </p>
                                <p className={styles.countdown}>
                                    Countdown: {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                                </p>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

export default Schedule;
