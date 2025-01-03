"use client";

import React, { useState } from 'react';
import './CommentSection.css'; // Import the CSS file

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
    <div className="post-comment">
      <textarea
        className="comment-textarea"
        placeholder="Discuss your favorite scene!"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ borderRadius: '9px' }}
      />
      <div className="actions">
        <label className="spoiler-label">
          <input
            type="checkbox"
            className="spoiler-checkbox"
            checked={isSpoiler}
            onChange={() => setIsSpoiler(!isSpoiler)}
          />
          Spoiler
        </label>
        <button className="post-button" onClick={handlePost} style={{ borderRadius: '9px' }}>
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default PostComment;
