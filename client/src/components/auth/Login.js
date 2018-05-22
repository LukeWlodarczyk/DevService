import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/auth';
import { clearErrors } from '../../actions/profile';
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email_or_username: '',
      password: '',
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
    if(Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }

  }


  static getDerivedStateFromProps = (nextProps) => {
    if(nextProps.auth.isAuthenticated) {
      nextProps.history.push('/dashboard');
    }
    if(nextProps.errors) {
      return { errors: nextProps.errors };
    }
  };

  onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email_or_username: this.state.email_or_username,
      password: this.state.password
    };

    this.props.loginUser(userData);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your DevService account</p>
              <form noValidate onSubmit={this.onSubmit} >
                <TextFieldGroup
                  placeholder="Email Address or username"
                  name="email_or_username"
                  type="text"
                  value={this.state.email_or_username}
                  onChange={this.onChange}
                  error={errors.email_or_username}
                />
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <input onChange={this.onChange} type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser, clearErrors })(Login);
