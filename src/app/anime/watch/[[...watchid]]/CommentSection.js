import React, { useState } from 'react';
import './CommentSection.css';

const CommentSection = ({ comments }) => {
  const [showSpoilers, setShowSpoilers] = useState(false);

  const toggleSpoilers = () => {
    setShowSpoilers(!showSpoilers);
  };

  return (
    <div className="comment-section">
      <h2>Comments</h2>
      <button onClick={toggleSpoilers}>
        {showSpoilers ? 'Hide Spoilers' : 'Show Spoilers'}
      </button>
      {comments.map((comment, index) => (
        <div key={index} className={`comment ${comment.spoiler && !showSpoilers ? 'spoiler' : ''}`}>
          <p>{comment.text}</p>
          <div className="badges">
            {comment.badges.map((badge, i) => (
              <span key={i} className="badge">{badge}</span>
            ))}
          </div>
        </div>
      ))}
      <textarea placeholder="Add a comment"></textarea>
      <button>Submit</button>
    </div>
  );
};

export default CommentSection;
