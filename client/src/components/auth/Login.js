import React, { Component } from 'react';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {}
    };
  }

  onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    console.log(userData);

  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    const inputClasses = errors.name ? "form-control form-control-lg is-invalid" : "form-control form-control-lg";

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your DevService account</p>
              <form noValidate onSubmit={this.onSubmit} >
                <div className="form-group">
                  <input onChange={this.onChange} type="email" className={inputClasses} placeholder="Email Address" name="email" />
                  {errors.email && (
                    <div className='invalid-feedback'>{errors.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <input onChange={this.onChange} type="password" className={inputClasses} placeholder="Password" name="password" />
                  {errors.password && (
                    <div className='invalid-feedback'>{errors.password}</div>
                  )}
                </div>
                <input onChange={this.onChange} type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
