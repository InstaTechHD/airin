"use client";

import React, { useState, useEffect } from 'react';
import PostComment from './PostComment';
import { fetchAniListUserData, fetchComments, postComment } from '@/lib/Anilistfunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faChevronDown, faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Import icons
import './CommentSection.css'; // Import the CSS file

const CommentSection = ({ animeId, episodeNumber, session, animeName }) => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState('latest');
  const [userData, setUserData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    if (session) {
      fetchAniListUserData(session).then(setUserData);
    }
    fetchCommentsData();
  }, [animeId, episodeNumber, filter, page, session]);

  const fetchCommentsData = async () => {
    try {
      setLoading(true);
      console.log(`Fetching comments for filter: ${filter}, page: ${page}`);
      const newComments = await fetchComments(animeId, episodeNumber, filter, page);
      console.log('Fetched comments:', newComments);
      setComments(prevComments => [...prevComments, ...newComments]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to fetch comments. Please try again later.');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setComments([]); // Reset comments when filter changes
    setPage(1); // Reset page when filter changes
    setError(null); // Clear any previous error
  };

  const handlePost = (comment, isSpoiler) => {
    if (!session) {
      // Prompt login if not logged in
      alert("Please log in with AniList to post a comment.");
    } else {
      postComment(animeId, episodeNumber, comment, isSpoiler, session).then(newComment => {
        setComments([newComment, ...comments]);
      });
    }
  };

  const handleScroll = (e) => {
    if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 10 && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="comment-section">
      <div className="header">
        <h3>
          <FontAwesomeIcon icon={faComment} /> {/* Add the comment icon */}
          Comments ({comments.length})
        </h3>
        <span>EP {episodeNumber}</span>
        <div className="filter">
          <select onChange={handleFilterChange} value={filter} className="filter-dropdown">
            <option value="latest">Latest</option>
            <option value="top">Top</option>
            <option value="oldest">Oldest</option>
          </select>
          <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
        </div>
      </div>
      {session ? (
        <div className="user-info">
          <img src={userData?.avatar} alt="User Avatar" className="avatar" />
          <span>{userData?.name}</span>
        </div>
      ) : (
        <div className="login-placeholder">
          <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
          <span>Comment on {animeName}</span>
        </div>
      )}
      <PostComment onPost={handlePost} />
      <div className="comments-container" onScroll={handleScroll}>
        {error && <div className="error-message">{error}</div>}
        {comments.map((comment, index) => (
          <div key={index} className="comment" style={{ borderRadius: '9px' }}>
            <p className={comment.isSpoiler ? 'spoiler-blur' : ''}>
              {comment.text}
            </p>
            <button className="reply-button">Reply</button>
            <button className="react-button">React</button>
          </div>
        ))}
        {loading && <div>Loading...</div>}
      </div>
    </div>
  );
};

export default CommentSection;
