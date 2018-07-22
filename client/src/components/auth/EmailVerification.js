import React, { Component } from 'react'
import { connect } from 'react-redux';
import { checkEmailVerUrl } from '../../actions/auth';
import { Link } from 'react-router-dom';

import NotFound from '../not-found/NotFound';

class EmailVerification extends Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: {},
    }
  }

  componentDidMount() {
    const { id, token } = this.props.match.params;
    this.props.checkEmailVerUrl({ id, token });
  }

  static getDerivedStateFromProps = (nextProps) => {
    if(nextProps.errors) {
      return { errors: nextProps.errors };
    }

    return null;
  };

  render() {
    const { errors } = this.state;
    const { auth: { isAuthenticated }} = this.props;

    if (errors.error) {
      return <NotFound error={errors} />
    }

    return (
        <div>
          <h1 className="display-4">Email Verified</h1>
          <p>Your email is verified. You can use all feature available in DevService. Enjoy!</p>
          {!isAuthenticated && <div>Now you can <Link to='/login'>login</Link>.</div>}
        </div>
      );
  }
}

const mapStateFromProps = ({ errors, auth }) => ({ errors, auth });

export default connect(mapStateFromProps, { checkEmailVerUrl })(EmailVerification);
