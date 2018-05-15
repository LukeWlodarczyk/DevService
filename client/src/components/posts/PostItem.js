import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { deletePost, addLike, disLike } from '../../actions/post';
import PostButton from './PostButton';

class PostItem extends Component {
  state = {
    likesCount: 0,
    dislikesCount: 0,
    likes: [],
    dislikes: [],
  }

  static getDerivedStateFromProps(nextProps) {
     return {
       likesCount: nextProps.post.likes.length,
       dislikesCount: nextProps.post.dislikes.length,
       likes: nextProps.post.likes,
       dislikes: nextProps.post.dislikes,
     };
  };

  onDeleteClick = (id) => {
    this.props.deletePost(id);
  }

  onLikeClick = (id) => {
    if(!this.findUserLike()) {
      this.setState({
        likesCount: this.state.likesCount+1,
        dislikesCount: this.findUserDislike() ? this.state.dislikesCount-1 : this.state.dislikesCount,
        likes: [{ user: this.props.auth.user.id } ,...this.state.likes],
        dislikes: this.state.dislikes.filter(like => like.user !== this.props.auth.user.id),
      })
    } else {
      this.setState({
        likesCount: this.state.likesCount-1,
        likes: this.state.likes.filter(like => like.user !== this.props.auth.user.id),
      })
    }
    this.props.addLike(id);
  }

  onDisLikeClick = (id) => {
    const { post, auth } = this.props;
    if(!this.findUserDislike()) {
      this.setState({
        likesCount: this.findUserLike() ? this.state.likesCount-1 : this.state.likesCount,
        dislikesCount: this.state.dislikesCount+1,
        likes: this.state.likes.filter(like => like.user !== auth.user.id),
        dislikes: [{ user: this.props.auth.user.id } ,...this.state.dislikes],
      })
    } else {
      this.setState({
        dislikesCount: this.state.dislikesCount-1,
        dislikes: this.state.dislikes.filter(like => like.user !== this.props.auth.user.id),
      })
    }
    this.props.disLike(id);
  }

  findUserLike() {
    const { auth } = this.props;
    return this.state.likes.some(like => like.user === auth.user.id)
  }

  findUserDislike() {
    const { auth } = this.props;
    return this.state.dislikes.some(like => like.user === auth.user.id)
  }

  render() {
    const { post, auth, showActions } = this.props;

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img
                className="rounded-circle d-none d-md-block"
                src={post.avatar}
                alt=""
              />
            </a>
            <br />
            <p className="text-center">{post.name}</p>
          </div>
          <div className="col-md-10">
            <h3>{post.title}</h3>
            <p className="lead">{post.text}</p>
            {
              showActions && (
                <span>
                  <PostButton
                    onClick={this.onLikeClick}
                    id={post._id}
                    icon={this.findUserLike() ? 'fas fa-thumbs-up text-success' : 'fas fa-thumbs-up'}
                    styles='btn btn-light mr-1'
                    count={this.state.likesCount}
                  />
                  <PostButton
                    onClick={this.onDisLikeClick}
                    id={post._id}
                    icon={this.findUserDislike() ? 'fas fa-thumbs-down text-danger' : 'fas fa-thumbs-down'}
                    styles='btn btn-light mr-1'
                    count={this.state.dislikesCount}
                  />
                  <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                    Comments
                  </Link>
                  {
                    post.user === auth.user.id && (
                      <PostButton
                        onClick={this.onDeleteClick}
                        id={post._id}
                        icon={'fas fa-times'}
                        styles='btn btn-danger mr-1'
                        count={false}
                      />
                    )
                  }
                </span>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  disLike: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deletePost, addLike, disLike })(PostItem);
