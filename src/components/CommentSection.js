"use client";

import React, { useState, useEffect } from 'react';
import PostComment from './PostComment';
import { fetchAniListUserData, fetchComments, postComment } from '@/lib/Anilistfunctions';
import './CommentSection.css'; // Import the CSS file

const CommentSection = ({ animeId, episodeNumber, session }) => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState('latest');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (session) {
      fetchAniListUserData(session).then(setUserData);
    }
    fetchComments(animeId, episodeNumber, filter).then(setComments);
  }, [animeId, episodeNumber, filter, session]);

  const handlePost = (comment, isSpoiler) => {
    if (!session) {
      // Prompt login if not logged in
      alert("Please log in with AniList to post a comment.");
      // Redirect to AniList login (adjust URL as necessary)
      window.location.href = "/api/auth/login";
    } else {
      postComment(animeId, episodeNumber, comment, isSpoiler, session).then(newComment => {
        setComments([newComment, ...comments]);
      });
    }
  };

  return (
    <div className="comment-section">
      <div className="header">
        <h3>Comments ({comments.length})</h3>
        <span>EP {episodeNumber}</span>
        <div className="filter">
          <select onChange={(e) => setFilter(e.target.value)} value={filter} className="filter-dropdown">
            <option value="latest">Latest</option>
            <option value="top">Top</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
      {session ? (
        <div className="user-info">
          <img src={userData?.avatar} alt="User Avatar" className="avatar" />
          <span>{userData?.name}</span>
        </div>
      ) : (
        <button onClick={() => window.location.href = "/api/auth/login"} className="login-button">
          Login to comment
        </button>
      )}
      <PostComment onPost={handlePost} />
      {comments.map((comment, index) => (
        <div key={index} className="comment" style={{ borderRadius: '9px' }}>
          <p className={comment.isSpoiler ? 'spoiler-blur' : ''}>
            {comment.text}
          </p>
          <button className="reply-button">Reply</button>
          <button className="react-button">React</button>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
