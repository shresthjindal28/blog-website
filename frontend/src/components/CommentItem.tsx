import { TrashIcon } from '@heroicons/react/24/outline';

interface CommentItemProps {
  comment: {
    _id: string;
    text: string;
    user: {
      _id: string;
      username: string;
      avatarUrl?: string;
    };
    createdAt: string;
  };
  onDelete?: (commentId: string) => void;
  canDelete: boolean;
}

const CommentItem = ({ comment, onDelete, canDelete }: CommentItemProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg transition-all hover:bg-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {comment.user.avatarUrl ? (
            <img 
              src={comment.user.avatarUrl} 
              alt={`${comment.user.username}'s avatar`} 
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
              {comment.user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-medium text-gray-900">{comment.user.username}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {formatDate(comment.createdAt)}
          </span>
          {canDelete && onDelete && (
            <button 
              onClick={() => onDelete(comment._id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Delete comment"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-gray-600 whitespace-pre-wrap">{comment.text}</p>
    </div>
  );
};

export default CommentItem; 