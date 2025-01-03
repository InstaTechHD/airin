import React, { useState, useEffect } from 'react';
import styles from '../../styles/Catalog.module.css'; // Assuming you have this CSS file

async function fetchSchedule() {
    try {
        const response = await fetch('https://api.jikan.moe/v4/schedules');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched Schedule Data:', data); // Debugging log
        return data.data; // Access the 'data' property that contains the schedule
    } catch (error) {
        console.error('Error fetching schedule:', error.message); // Log any errors
        throw error; // Re-throw the error to handle it in the component
    }
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
                console.error('Error in useEffect:', error.message); // Log any errors
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
                            src={item.images.jpg.image_url}
                            alt={item.title}
                            className={styles.coverImage}
                        />
                        <div className={styles.scheduleInfo}>
                            <h3 className={styles.animeTitle}>{item.title}</h3>
                            <p className={styles.episode}>Episode {item.episodes}</p>
                            <p className={styles.airingAt}>
                                Airing at: {new Date(item.aired.from).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Schedule;
