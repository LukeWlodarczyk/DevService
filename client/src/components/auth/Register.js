import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/auth';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your DevConnector account</p>
              <form onSubmit={this.onSubmit} noValidate >
                <div className="form-group">
                  <input onChange={this.onChange} type="text" className={errors.name ? "form-control form-control-lg is-invalid" : "form-control form-control-lg"} placeholder="Name" name="name" />
                  {errors.name && (
                    <div className='invalid-feedback'>{errors.name}</div>
                  )}
                </div>
                <div className="form-group">
                  <input onChange={this.onChange} type="email" className={errors.email ? "form-control form-control-lg is-invalid" : "form-control form-control-lg"} placeholder="Email Address" name="email" />
                  {errors.email && (
                    <div className='invalid-feedback'>{errors.email}</div>
                  )}
                  <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                </div>
                <div className="form-group">
                  <input onChange={this.onChange} type="password" className={errors.password ? "form-control form-control-lg is-invalid" : "form-control form-control-lg"} placeholder="Password" name="password" />
                  {errors.password && (
                    <div className='invalid-feedback'>{errors.password}</div>
                  )}
                </div>
                <div className="form-group">
                  <input onChange={this.onChange} type="password" className={errors.password2 ? "form-control form-control-lg is-invalid" : "form-control form-control-lg"} placeholder="Confirm Password" name="password2" />
                  {errors.password2 && (
                    <div className='invalid-feedback'>{errors.password2}</div>
                  )}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(Register);
