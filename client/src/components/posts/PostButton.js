import React, { Component } from 'react';

class PostButton extends Component {

  onLikeClick = () => {
    this.props.onClick(this.props.id);
  }

  render() {
    const { styles, icon, count } = this.props;

    return (
      <button
        onClick={this.onLikeClick}
        type="button"
        className={styles}
      >
        <i className={icon} />
        { count !== false && <span className="badge badge-light">{count}</span>}
      </button>
    )
  }
}

export default PostButton;
