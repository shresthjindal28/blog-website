import { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const LikeButton = ({ isLiked, likeCount, onLike, size = 'md' }: LikeButtonProps) => {
  const [animate, setAnimate] = useState(false);
  const [prevIsLiked, setPrevIsLiked] = useState(isLiked);

  useEffect(() => {
    if (isLiked !== prevIsLiked) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      setPrevIsLiked(isLiked);
      return () => clearTimeout(timer);
    }
  }, [isLiked, prevIsLiked]);

  const handleClick = () => {
    setAnimate(true);
    onLike();
  };

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const animationClass = animate
    ? isLiked
      ? 'scale-125 animate-pulse'
      : 'scale-75 animate-ping'
    : '';

  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-1 ${
        isLiked ? 'text-red-500' : 'text-gray-500'
      } hover:text-red-500 transition-colors group`}
      aria-label={isLiked ? "Unlike this post" : "Like this post"}
    >
      <span className="relative inline-block">
        {isLiked ? (
          <HeartSolidIcon className={`${sizeClasses[size]} transform group-hover:scale-110 transition-transform ${animationClass}`} />
        ) : (
          <HeartIcon className={`${sizeClasses[size]} transform group-hover:scale-110 transition-transform ${animationClass}`} />
        )}
      </span>
      <span className={likeCount > 0 ? 'font-medium' : ''}>{likeCount}</span>
    </button>
  );
};

export default LikeButton; 