import React, { Component } from 'react';

class PostButton extends Component {

  onClickButton = () => {
    this.props.onClick(this.props.postId);
  }

  render() {
    const { styles, icon, count } = this.props;

    return (
      <button
        onClick={this.onClickButton}
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
