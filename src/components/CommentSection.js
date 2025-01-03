import React, { useState } from 'react';

const CommentSection = ({ comments }) => {
  const [visibleComments, setVisibleComments] = useState(5);
  const [spoilerBlur, setSpoilerBlur] = useState(true);

  const toggleSpoiler = () => setSpoilerBlur(!spoilerBlur);

  const showMoreComments = () => {
    setVisibleComments((prev) => prev + 5);
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {comments.slice(0, visibleComments).map((comment, index) => (
        <div key={index} className="comment">
          <p className={comment.isSpoiler && spoilerBlur ? 'spoiler-blur' : ''}>
            {comment.text}
          </p>
          {comment.isSpoiler && (
            <button onClick={toggleSpoiler}>
              {spoilerBlur ? 'Show Spoiler' : 'Hide Spoiler'}
            </button>
          )}
        </div>
      ))}
      {visibleComments < comments.length && (
        <button onClick={showMoreComments}>Show More Comments</button>
      )}
    </div>
  );
};

export default CommentSection;
