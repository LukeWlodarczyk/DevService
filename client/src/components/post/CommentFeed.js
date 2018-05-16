import React from 'react';
import PropTypes from 'prop-types';
import CommentItem from './CommentItem';

const CommentFeed = ({ comments, postId, postAuthor }) => {
  const best = comments.find(comment => comment.best)
  const sorted = comments.filter(comment => !comment.best).sort( (a, b) => new Date(b.date) - new Date(a.date));
  if(!best) {
    return sorted.map(comment => (
        <CommentItem key={comment._id} comment={comment} postId={postId} postAuthor={postAuthor} />
      ))
  }

  return [best, ...sorted].map(comment => (
      <CommentItem key={comment._id} comment={comment} postId={postId} postAuthor={postAuthor} />
    ))
}

CommentFeed.propTypes = {
  comments: PropTypes.array.isRequired,
  postId: PropTypes.string.isRequired
};

export default CommentFeed;
