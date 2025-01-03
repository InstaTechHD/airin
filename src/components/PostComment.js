"use client";

import React, { useState } from 'react';

const PostComment = ({ onPost }) => {
  const [comment, setComment] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);

  const handlePost = () => {
    if (comment.trim() !== '') {
      onPost(comment, isSpoiler);
      setComment('');
    }
  };

  return (
    <div style={styles.postComment}>
      <textarea
        style={styles.textarea}
        placeholder="Discuss your favorite scene!"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div style={styles.actions}>
        <label style={styles.spoilerLabel}>
          <input
            type="checkbox"
            style={styles.spoilerCheckbox}
            checked={isSpoiler}
            onChange={() => setIsSpoiler(!isSpoiler)}
          />
          Spoiler
        </label>
        <button style={styles.postButton} onClick={handlePost}>Add Comment</button>
      </div>
    </div>
  );
};

const styles = {
  postComment: {
    marginBottom: '20px',
  },
  textarea: {
    width: '100%',
    height: '80px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spoilerLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  spoilerCheckbox: {
    marginRight: '5px',
  },
  postButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default PostComment;
