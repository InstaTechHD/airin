import React, { useState, useEffect } from 'react';
import styles from '../../styles/Catalog.module.css'; // Assuming you have this CSS file

async function fetchSchedule() {
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

// Example mapping function
const malIdToIdMapping = {
    1: 101,
    2: 102,
    3: 103,
    // Add more mappings as needed
};

function getIdFromMalId(malId) {
    return malIdToIdMapping[malId] || malId; // Fallback to malId if no mapping is found
}

function Schedule() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        fetchSchedule()
            .then(data => {
                // Filter out past anime
                const upcomingAnime = data.filter(item => new Date(item.aired.from) >= new Date());
                // Sort by airing date
                upcomingAnime.sort((a, b) => new Date(a.aired.from) - new Date(b.aired.from));
                
                // Map mal_id to id
                const animeWithId = upcomingAnime.map(item => ({
                    ...item,
                    id: getIdFromMalId(item.mal_id)
                }));

                setSchedule(animeWithId);
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

    const getTimeRemaining = (airingAt) => {
        const total = new Date(airingAt).getTime() - currentTime;
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
                    const timeRemaining = getTimeRemaining(item.aired.from);
                    return (
                        <div
                            key={index}
                            className={styles.scheduleItem}
                            onClick={() => window.location.href = `/anime/${item.id}`}
                        >
                            <div className={styles.scheduleItemContent}>
                                <img
                                    src={item.images.jpg.image_url}
                                    alt={item.title}
                                    className={styles.coverImage}
                                />
                                <div className={styles.scheduleInfo}>
                                    <h3 className={styles.animeTitle}>{item.title}</h3>
                                    <p className={styles.airingAt}>
                                        Airing: {new Date(item.aired.from).toLocaleString()}
                                    </p>
                                    <p className={styles.countdown}>
                                        Countdown: {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Schedule;
