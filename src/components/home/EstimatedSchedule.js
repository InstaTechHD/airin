// src/components/home/EstimatedSchedule.js
import React from 'react';

const EstimatedSchedule = ({ schedule }) => {
  return (
    <div className="estimated-schedule">
      <h2>Estimated Schedule</h2>
      <ul>
        {schedule.map((item, index) => (
          <li key={index}>
            <strong>{item.date}:</strong> {item.activity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EstimatedSchedule;
