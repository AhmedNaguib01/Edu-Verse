import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  AvatarFallback,
  Badge,
} from "../components/ui/display";
import { Button } from "../components/ui/button";
import {
  Heart,
  MessageCircle,
  Smile,
  Laugh,
  Frown,
  ThumbsUp,
  Send,
  ArrowLeft,
} from "lucide-react";
import { getSession } from "../api/session";
import { getComments, createComment } from "../api/comments";
import { getReactions, upsertReaction, deleteReaction } from "../api/reactions";
import { getInitials, formatRelativeTime } from "../lib/utils";
import { getFileUrl } from "../api/files";
import { toast } from "sonner";
import "../styles/post-detail.css";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [reactions, setReactions] = useState({
    reactions: {},
    userReaction: null,
  });

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session.user);
      loadPost();
    }

    // Refresh post every 30 seconds to get updated user names
    const refreshInterval = setInterval(() => {
      if (getSession()) {
        loadPost();
      }
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${getSession().token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load post");
      }

      const data = await response.json();

      // The API returns { post, comments, reactions, userReaction }
      setPost(data.post);
      setComments(data.comments || []);
      setReactions({
        reactions: data.reactions || {},
        userReaction: data.userReaction || null,
      });
    } catch (error) {
      console.error("Error loading post:", error);
      toast.error("Failed to load post");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const loadReactions = async () => {
    try {
      const data = await getReactions(postId);
      setReactions(data);
    } catch (error) {
      console.error("Error loading reactions:", error);
    }
  };

  const handleReaction = async (type) => {
    try {
      if (reactions.userReaction === type) {
        await deleteReaction(postId);
      } else {
        await upsertReaction(postId, type);
      }
      await loadReactions();
    } catch (error) {
      console.error("Error handling reaction:", error);
      toast.error("Failed to update reaction");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    try {
      await createComment(postId, commentText);
      setCommentText("");
      await loadComments();
      toast.success("Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const reactionIcons = {
    like: ThumbsUp,
    love: Heart,
    laugh: Laugh,
    shocked: Smile,
    sad: Frown,
  };

  if (loading) {
    return (
      <div className="post-detail-page">
        <Navbar user={user} />
        <div className="post-detail-container">
          <div className="loading-post">Loading post...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail-page">
        <Navbar user={user} />
        <div className="post-detail-container">
          <div className="error-post">Post not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <Navbar user={user} />
      <div className="post-detail-container">
        <div className="post-detail-content">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="back-button"
          >
            <ArrowLeft size={20} />
            Back
          </Button>

          {/* Post Card */}
          <Card className="post-card">
            <CardHeader className="post-header">
              <div className="post-user-info">
                <div className="post-user">
                  <Avatar
                    onClick={() => navigate(`/profile/${post.sender?.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {post.sender?.profilePicture ? (
                      <img
                        src={getFileUrl(post.sender.profilePicture)}
                        alt={post.sender.name}
                        className="avatar-img"
                      />
                    ) : (
                      <AvatarFallback className="avatar-fallback-secondary">
                        {post.sender?.name
                          ? getInitials(post.sender.name)
                          : "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="user-details">
                    <p
                      className="user-name clickable-username"
                      onClick={() => navigate(`/profile/${post.sender?.id}`)}
                    >
                      {post.sender?.name || "Unknown"}
                    </p>
                    <p className="user-meta">
                      {formatRelativeTime(post.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="post-header-right">
                  {post.type && (
                    <Badge className="badge-secondary">{post.type}</Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="post-content">
              <div className="post-body">
                <h1 className="post-title">{post.title || "Untitled Post"}</h1>
                <p className="post-text">
                  {post.body || "No content available"}
                </p>
              </div>

              {/* Post Images */}
              {post.attachmentsId && post.attachmentsId.length > 0 && (
                <div className="post-images">
                  {post.attachmentsId.map((fileId) => (
                    <img
                      key={fileId}
                      src={`${process.env.REACT_APP_API_URL}/files/${fileId}`}
                      alt="Post attachment"
                      className="post-image"
                    />
                  ))}
                </div>
              )}

              {/* Reactions */}
              <div className="post-reactions">
                {Object.entries(reactionIcons).map(([type, Icon]) => {
                  const count = reactions.reactions[type] || 0;
                  const isActive = reactions.userReaction === type;

                  return (
                    <Button
                      key={type}
                      variant="ghost"
                      size="sm"
                      className={`reaction-button ${
                        isActive ? "reaction-active" : ""
                      }`}
                      onClick={() => handleReaction(type)}
                    >
                      <Icon size={18} />
                      {(count > 0 || isActive) && <span>{count || 1}</span>}
                    </Button>
                  );
                })}
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                <h3 className="comments-title">
                  <MessageCircle size={20} />
                  Comments ({comments.length})
                </h3>

                <div className="comments-list">
                  {comments.length === 0 ? (
                    <p className="no-comments">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment._id} className="comment">
                        <Avatar
                          className="comment-avatar"
                          onClick={() =>
                            navigate(`/profile/${comment.sender.id}`)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          {comment.sender.profilePicture ? (
                            <img
                              src={getFileUrl(comment.sender.profilePicture)}
                              alt={comment.sender.name}
                              className="avatar-img"
                            />
                          ) : (
                            <AvatarFallback className="avatar-fallback-secondary">
                              {getInitials(comment.sender.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="comment-content">
                          <div className="comment-header">
                            <span
                              className="comment-author clickable-username"
                              onClick={() =>
                                navigate(`/profile/${comment.sender.id}`)
                              }
                            >
                              {comment.sender.name}
                            </span>
                            <span className="comment-time">
                              {formatRelativeTime(comment.createdAt)}
                            </span>
                          </div>
                          <p className="comment-text">{comment.body}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddComment} className="add-comment">
                  <Avatar>
                    {user?.profilePicture ? (
                      <img
                        src={getFileUrl(user.profilePicture)}
                        alt={user.name}
                        className="avatar-img"
                      />
                    ) : (
                      <AvatarFallback className="avatar-fallback-primary">
                        {user?.name ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="comment-input-container">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="comment-input"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!commentText.trim()}
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
