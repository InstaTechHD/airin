"use client";

import React, { useState, useEffect } from "react";
import PostComment from "./PostComment";
import { fetchAniListUserData, fetchComments, postComment } from "@/lib/Anilistfunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faChevronDown, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./CommentSection.css";

const CommentSection = ({ animeId, episodeNumber, session, animeName }) => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("latest");
  const [userData, setUserData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      fetchAniListUserData(session)
        .then(setUserData)
        .catch((err) => {
          console.error("Error fetching user data:", err);
          setError("Failed to fetch user data.");
        });
    }
    fetchCommentsData();
  }, [animeId, episodeNumber, filter, page, session]);

  const fetchCommentsData = async () => {
    try {
      setLoading(true);
      console.log(`Fetching comments for filter: ${filter}, page: ${page}`);
      const newComments = await fetchComments(animeId, episodeNumber, filter, page);
      console.log("Fetched comments:", newComments);
      setComments((prevComments) => [...prevComments, ...newComments]);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to fetch comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setComments([]);
    setPage(1);
    setError(null);
  };

  const handlePost = async (comment, isSpoiler) => {
    if (!session) {
      alert("Please log in with AniList to post a comment.");
      return;
    }
    try {
      console.log("Posting comment:", { comment, isSpoiler });
      const newComment = await postComment(animeId, episodeNumber, comment, isSpoiler, session);
      console.log("Comment posted successfully:", newComment);
      setComments((prevComments) => [newComment, ...prevComments]);
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to post comment. Please try again later.");
    }
  };

  const handleScroll = (e) => {
    if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 10 && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="comment-section">
      <div className="header">
        <h3>
          <FontAwesomeIcon icon={faComment} /> Comments ({comments.length})
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
          <div key={index} className="comment" style={{ borderRadius: "9px" }}>
            <p className={comment.isSpoiler ? "spoiler-blur" : ""}>{comment.text}</p>
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
