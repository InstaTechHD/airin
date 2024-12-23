// src/components/home/EstimatedSchedule.js
"use client"; // Add this line

import React from 'react';

const EstimatedSchedule = ({ schedule }) => {
  return (
    <div className="estimated-schedule">
      <h2 className="schedule-title">Estimated Schedule</h2>
      <ul className="schedule-list">
        {schedule.map((item, index) => (
          <li key={index} className="schedule-item">
            <strong>{item.date}:</strong> {item.activity}
          </li>
        ))}
      </ul>
      <style jsx>{`
        .estimated-schedule {
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .schedule-title {
          font-size: 1.5rem;
          margin-bottom: 10px;
        }
        .schedule-list {
          list-style-type: none;
          padding: 0;
        }
        .schedule-item {
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .schedule-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

export default EstimatedSchedule;
