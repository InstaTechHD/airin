"use client";

import React, { useState, useEffect } from 'react';
import PostComment from './PostComment';
import { fetchAniListUserData, fetchComments, postComment } from '@/lib/Anilistfunctions';

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
    postComment(animeId, episodeNumber, comment, isSpoiler, session).then(newComment => {
      setComments([newComment, ...comments]);
    });
  };

  return (
    <div style={styles.commentSection}>
      <div style={styles.header}>
        <h3>Comments ({comments.length})</h3>
        <span>EP {episodeNumber}</span>
        <div style={styles.filter}>
          <button onClick={() => setFilter('latest')}>Latest</button>
          <button onClick={() => setFilter('top')}>Top</button>
          <button onClick={() => setFilter('oldest')}>Oldest</button>
        </div>
      </div>
      {session ? (
        <div style={styles.userInfo}>
          <img src={userData?.avatar} alt="User Avatar" style={styles.avatar} />
          <span>{userData?.name}</span>
        </div>
      ) : (
        <p>Login to comment</p>
      )}
      {session && <PostComment onPost={handlePost} />}
      {comments.map((comment, index) => (
        <div key={index} style={styles.comment}>
          <p style={comment.isSpoiler ? styles.spoilerBlur : {}}>
            {comment.text}
          </p>
          <button onClick={() => {/* handle reply */}}>Reply</button>
          <button onClick={() => {/* handle reaction */}}>React</button>
        </div>
      ))}
    </div>
  );
};

const styles = {
  commentSection: {
    marginBottom: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  filter: {
    display: 'flex',
    gap: '10px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
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
};

export default CommentSection;
