import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./PostComment.css";

const PostComment = ({ onPost }) => {
  const [comment, setComment] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!comment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setError(null); // Clear any previous errors
    setLoading(true);

    try {
      await onPost(comment, isSpoiler);
      setComment(""); // Clear the input after successful submission
      setIsSpoiler(false);
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to post your comment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };

  return (
    <div className="post-comment">
      {error && <div className="error-message">{error}</div>}
      <textarea
        className="comment-input"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment here..."
        onKeyPress={handleKeyPress}
      />
      <div className="actions">
        <label className="spoiler-checkbox">
          <input
            type="checkbox"
            checked={isSpoiler}
            onChange={() => setIsSpoiler(!isSpoiler)}
          />
          <FontAwesomeIcon icon={faEyeSlash} /> Mark as Spoiler
        </label>
        <button
          className="post-button"
          onClick={handlePost}
          disabled={loading}
        >
          {loading ? "Posting..." : <FontAwesomeIcon icon={faPaperPlane} />}
        </button>
      </div>
    </div>
  );
};

export default PostComment;
