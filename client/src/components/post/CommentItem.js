import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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

    const user = {
      username: comment.user ? comment.user.username : 'deleted',
      avatar: comment.user ? comment.user.avatar : 'http://www.gravatar.com/avatar/37d96b80617a8fe7f294ecd968da71d3?s=200&r=pg&d=mm',
      name: comment.user ? comment.user.name : 'User deleted',
      id: comment.user ? comment.user._id : 'deleted',
    }

    const author = {
      id: postAuthor ? postAuthor._id : 'deleted',
    }

    return (
      <div className={comment.best ? "card card-body sm-3 border-success mb-5" : "card card-body sm-3 mb-3"}>
        <div className="row">
          <div className="col-sm-2">
            <Link to={'/profile/'+user.username} className="btn btn-info">
              <img
                className="rounded-circle d-none d-sm-block"
                src={user.avatar}
              />
              <br />
              <p className="text-center" style={{whiteSpace: 'pre-wrap'}}>{user.name}</p>
            </Link>
          </div>
          <div className="col-sm-10 px-3 px-sm-5">
            <div className="text-left text-sm-right small">{new Date(comment.date).toLocaleDateString()}</div>
            <p className="lead">{comment.text}</p>
            <div className="text-center text-sm-left">
              {user.id === auth.user.id ? (
                <button
                  onClick={this.onDeleteClick}
                  type="button"
                  className="btn btn-danger mr-1"
                >
                  <i className="fas fa-times" />
                </button>
              ) : null}
              {author.id === auth.user.id ? (
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
