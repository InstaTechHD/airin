"use client";

import React, { useState } from 'react';

const CommentSection = ({ comments }) => {
  const [visibleComments, setVisibleComments] = useState(5);
  const [spoilerBlur, setSpoilerBlur] = useState(true);

  const toggleSpoiler = () => setSpoilerBlur(!spoilerBlur);

  const showMoreComments = () => {
    setVisibleComments((prev) => prev + 5);
  };

  const styles = {
    commentSection: {
      marginBottom: '20px',
    },
    comment: {
      marginBottom: '10px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    spoilerBlur: {
      filter: 'blur(5px)',
    },
    button: {
      marginTop: '5px',
    },
  };

  return (
    <div style={styles.commentSection}>
      <h3>Comments</h3>
      {comments.slice(0, visibleComments).map((comment, index) => (
        <div key={index} style={styles.comment}>
          <p style={comment.isSpoiler && spoilerBlur ? styles.spoilerBlur : {}}>
            {comment.text}
          </p>
          {comment.isSpoiler && (
            <button style={styles.button} onClick={toggleSpoiler}>
              {spoilerBlur ? 'Show Spoiler' : 'Hide Spoiler'}
            </button>
          )}
        </div>
      ))}
      {visibleComments < comments.length && (
        <button style={styles.button} onClick={showMoreComments}>Show More Comments</button>
      )}
    </div>
  );
};

export default CommentSection;
