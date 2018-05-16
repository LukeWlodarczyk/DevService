import React from 'react';
import PropTypes from 'prop-types';
import CommentItem from './CommentItem';

const CommentFeed = ({ comments, postId }) => (
  comments.map(comment => (
      <CommentItem key={comment._id} comment={comment} postId={postId} />
    ))
)

CommentFeed.propTypes = {
  comments: PropTypes.array.isRequired,
  postId: PropTypes.string.isRequired
};

export default CommentFeed;
