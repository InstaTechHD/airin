import React, { useState, useEffect } from 'react';
import styles from '../../styles/Catalog.module.css'; // Assuming you have this CSS file
import { gql, request } from 'graphql-request';

async function fetchSchedule() {
    const query = gql`
        query {
            Page(page: 1, perPage: 50) {
                media(type: ANIME, sort: START_DATE_DESC, status: NOT_YET_RELEASED) {
                    id
                    title {
                        romaji
                    }
                    startDate {
                        year
                        month
                        day
                    }
                    coverImage {
                        large
                    }
                }
            }
        }
    `;
    try {
        const response = await request('https://graphql.anilist.co', query);
        return response.Page.media;
    } catch (error) {
        console.error('Error fetching schedule from Anilist:', error.message);
        throw error;
    }
}

function Schedule() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        fetchSchedule()
            .then(data => {
                setSchedule(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error in useEffect:', error.message);
                setError(error);
                setLoading(false);
            });

        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getTimeRemaining = (startDate) => {
        const total = new Date(startDate.year, startDate.month - 1, startDate.day).getTime() - currentTime;
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
            <h2 className={styles.scheduleTitle}>Upcoming Anime Schedule</h2>
            <div className={styles.scheduleContainer}>
                {schedule.map((item, index) => {
                    const timeRemaining = getTimeRemaining(item.startDate);
                    return (
                        <a
                            key={index}
                            href={`https://anilist.co/anime/${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.scheduleItem}
                        >
                            <div className={styles.scheduleInfo}>
                                <h3 className={styles.animeTitle}>{item.title.romaji}</h3>
                                <p className={styles.airingAt}>
                                    Airing at: {new Date(item.startDate.year, item.startDate.month - 1, item.startDate.day).toLocaleString()}
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
