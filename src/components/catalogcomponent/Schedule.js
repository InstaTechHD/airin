import React, { useState, useEffect } from 'react';
import styles from '../../styles/Catalog.module.css'; // Assuming you have this CSS file

async function fetchSchedule() {
    const response = await fetch('https://animeschedule.net/api/v3/anime');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched Schedule Data:', data); // Debugging log
    return data;
}

function Schedule() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSchedule()
            .then(data => {
                setSchedule(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching schedule:', error); // Log any errors
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className={styles.schedule}>Loading schedule...</div>; // Show loading message
    }

    if (error) {
        return <div className={styles.schedule}>Error loading schedule: {error.message}</div>; // Show error message
    }

    return (
        <div className={styles.schedule}>
            <h2 className={styles.scheduleTitle}>Anime Schedule</h2>
            <div className={styles.scheduleContainer}>
                {schedule.map((item, index) => (
                    <div key={index} className={styles.scheduleItem}>
                        <img
                            src={item.image_url}
                            alt={item.name}
                            className={styles.coverImage}
                        />
                        <div className={styles.scheduleInfo}>
                            <h3 className={styles.animeTitle}>{item.name}</h3>
                            <p className={styles.episode}>Episode {item.episode}</p>
                            <p className={styles.airingAt}>
                                Airing at: {new Date(item.airing_time).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Schedule;
