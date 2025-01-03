import React, { useState, useEffect } from 'react';
import styles from '../../styles/Catalog.module.css';
import { gql, request } from 'graphql-request';

// Function to fetch the upcoming anime schedule from Anilist
async function fetchSchedule() {
    const query = gql`
        query {
            Page(page: 1, perPage: 50) {
                media(type: ANIME, sort: START_DATE, status: NOT_YET_RELEASED) {
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
                const sortedData = data
                    .filter(item => item.startDate.year && item.startDate.month && item.startDate.day)
                    .sort((a, b) => {
                        const dateA = new Date(a.startDate.year, a.startDate.month - 1, a.startDate.day);
                        const dateB = new Date(b.startDate.year, b.startDate.month - 1, b.startDate.day);
                        return dateB - dateA;
                    })
                    .slice(0, 5);  // Limit to 5 upcoming anime
                setSchedule(sortedData);
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
            {schedule.map((item, index) => {
                const timeRemaining = getTimeRemaining(item.startDate);
                return (
                    <div key={index} className={styles.scheduleCard}>
                        <img src={item.coverImage.large} alt={item.title.romaji} className={styles.scheduleImage} />
                        <div className={styles.scheduleInfo}>
                            <h3 className={styles.scheduleTitle}>{item.title.romaji}</h3>
                            <p className={styles.scheduleDate}>
                                Airing at: {new Date(item.startDate.year, item.startDate.month - 1, item.startDate.day).toLocaleString()}
                            </p>
                            <p className={styles.countdown}>
                                Countdown: {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Schedule;
