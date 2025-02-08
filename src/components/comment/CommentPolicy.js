import React from "react";
import { useNavigate } from "react-router-dom";
import "./CommentPolicy.css";

const CommentPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="comment-policy-container">
      <h1>Comment Policy</h1>
      <p>
        We welcome discussions and constructive conversations. By commenting on
        this website, you agree to abide by our comment policy.
      </p>

      <h2>Respectful Discussion</h2>
      <p>
        We encourage healthy debate but ask that all comments remain respectful.
        Personal attacks, hate speech, and harassment will not be tolerated.
      </p>

      <h2>Moderation</h2>
      <p>
        Comments may be moderated to maintain a positive and respectful
        community. If your comment does not appear immediately, it may be under
        review.
      </p>

      <h2>What We Do Not Allow</h2>

      <h3>1. Hate Speech & Harassment</h3>
      <p>
        Any content that promotes discrimination, violence, or harassment
        against individuals or groups will be removed.
      </p>

      <h3>2. Spam & Self-Promotion</h3>
      <p>
        Comments containing excessive links, advertisements, or self-promotion
        unrelated to the discussion topic will be removed.
      </p>

      <h3>3. Off-Topic & Irrelevant Comments</h3>
      <p>
        Please keep comments relevant to the discussion. Off-topic remarks may
        be removed to maintain meaningful conversations.
      </p>

      <h3>4. Profanity & Inappropriate Content</h3>
      <p>
        Avoid using offensive language, explicit content, or anything deemed
        inappropriate for a general audience.
      </p>

      <h2>Engaging in a Positive Community</h2>
      <p>
        We value diverse perspectives and encourage thoughtful discussions.
        Please be kind, open-minded, and contribute constructively.
      </p>

      <h2>Reporting Issues</h2>
      <p>
        If you see a comment that violates this policy, please report it to us
        at{" "}
        <a href="mailto:trulyepickstudios@gmail.com">
          trulyepickstudios@gmail.com
        </a>
        .
      </p>

      <button className="comment-back-btn" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default CommentPolicy;
