import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { commentService } from '../../services/commentService';
import CommentItem from './CommentItem';
import Button from '../ui/Button';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await commentService.getComments(postId);
      // The backend returns nested comments if using graphLookup correctly
      // Or we assemble them here if it returns a flat list
      // For now, assuming backend returns nested structure in `replies`
      setComments(res.data);
    } catch (err) {
      addToast('Failed to load comments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await commentService.createComment({ postId, text: newComment });
      setNewComment('');
      fetchComments(); // Refetch to get populated user and updated list
      addToast('Comment posted', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId, text) => {
    try {
      await commentService.replyToComment(parentId, { text });
      fetchComments();
      addToast('Reply posted', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to post reply', 'error');
    }
  };

  const handleEdit = async (commentId, text) => {
    try {
      await commentService.editComment(commentId, { text });
      fetchComments();
      addToast('Comment updated', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update comment', 'error');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await commentService.deleteComment(commentId);
      fetchComments();
      addToast('Comment deleted', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to delete comment', 'error');
    }
  };

  const handleLike = async (commentId, isLiked) => {
    if (!user) return addToast('Please sign in to like comments', 'info');
    try {
      if (isLiked) {
        await commentService.unlikeComment(commentId);
      } else {
        await commentService.likeComment(commentId);
      }
      fetchComments();
    } catch (err) {
      // Silently fail or toast
    }
  };

  return (
    <section className="mt-16 pt-16 border-t border-border-subtle" id="comments">
      <h2 className="text-2xl font-display font-semibold mb-8">Comments ({comments.length})</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="flex gap-4">
            <img
              src={user.profileImage || 'https://via.placeholder.com/40'}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover hidden sm:block"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="input-base w-full min-h-[100px] resize-y mb-3"
              />
              <div className="flex justify-end">
                <Button type="submit" isLoading={submitting}>Post Comment</Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-bg-elevated p-6 rounded-lg border border-border-subtle mb-12 text-center">
          <p className="text-text-secondary mb-4">You must be signed in to leave a comment.</p>
          <Button variant="primary" onClick={() => window.location.href = '/login'}>Sign In</Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-highlight"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLike={handleLike}
            />
          ))}
          {comments.length === 0 && (
            <p className="text-text-tertiary italic text-center py-8">Be the first to share your thoughts.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default CommentSection;
