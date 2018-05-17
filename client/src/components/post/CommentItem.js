import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteComment, setBestComment } from '../../actions/post';

class CommentItem extends Component {

  onDeleteClick = () => {
    this.props.deleteComment(this.props.postId, this.props.comment._id);
  }

  onSetBestCommentClick = () => {
    this.props.setBestComment(this.props.postId, this.props.comment._id);
  }

  render() {
    const { comment, auth, postAuthor } = this.props;
    console.log('aaaaaaaaaa');

    return (
      <div className={comment.best ? "card card-body mb-3 border-success" : "card card-body mb-3"}>
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img
                className="rounded-circle d-none d-md-block"
                src={comment.avatar}
                alt=""
              />
            </a>
            <br />
            <p className="text-center">{comment.name}</p>
          </div>
          <div className="col-md-10">
            <div className="text-right small">{new Date(comment.date).toLocaleDateString()}</div>
            <p className="lead">{comment.text}</p>
            <div className="text-center text-md-left">
              {comment.user === auth.user.id ? (
                <button
                  onClick={this.onDeleteClick}
                  type="button"
                  className="btn btn-danger mr-1"
                >
                  <i className="fas fa-times" />
                </button>
              ) : null}
              {postAuthor === auth.user.id ? (
                <button
                  onClick={this.onSetBestCommentClick}
                  type="button"
                  className="btn btn-success mr-1"
                >
                  <i className="fas fa-trophy" />
                </button>
              ) : null}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  setBestComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deleteComment, setBestComment })(CommentItem);
