import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatRelativeTime } from '../../utils/formatDate';
import Button from '../ui/Button';

const CommentItem = ({ comment, depth = 0, onReply, onEdit, onDelete, onLike }) => {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const isOwner = user && user._id === comment.user?._id;
  const isLiked = user && comment.likedBy?.includes(user._id);

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply(comment._id, replyText);
    setReplyText('');
    setIsReplying(false);
  };

  const handleEditSubmit = () => {
    if (!editText.trim() || editText === comment.text) {
      setIsEditing(false);
      return;
    }
    onEdit(comment._id, editText);
    setIsEditing(false);
  };

  return (
    <div className={`mt-6 ${depth > 0 ? 'ml-6 md:ml-12 border-l border-border-subtle pl-4 md:pl-6' : ''}`}>
      <div className="flex gap-4">
        <img
          src={comment.user?.profileImage || 'https://via.placeholder.com/40'}
          alt={comment.user?.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-text-primary">{comment.user?.name}</span>
            <span className="text-text-tertiary text-xs">{formatRelativeTime(comment.createdAt)}</span>
            {comment.edited && <span className="text-text-tertiary text-xs italic">(edited)</span>}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="input-base w-full min-h-[80px] resize-y"
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleEditSubmit}>Save</Button>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">{comment.text}</p>
          )}

          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => onLike(comment._id, isLiked)}
              className={`flex items-center gap-1 text-xs transition-colors ${
                isLiked ? 'text-accent-highlight' : 'text-text-tertiary hover:text-text-primary'
              }`}
            >
              <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {comment.likesCount > 0 && comment.likesCount}
            </button>
            
            {user && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs text-text-tertiary hover:text-text-primary transition-colors font-medium"
              >
                Reply
              </button>
            )}

            {isOwner && (
              <>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-text-tertiary hover:text-accent-highlight transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(comment._id)}
                  className="text-xs text-text-tertiary hover:text-accent-danger transition-colors font-medium"
                >
                  Delete
                </button>
              </>
            )}
          </div>

          {isReplying && (
            <div className="mt-4 flex gap-3">
              <img src={user.profileImage} alt="" className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="input-base w-full min-h-[80px] resize-y text-sm"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleReplySubmit}>Reply</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply._id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
