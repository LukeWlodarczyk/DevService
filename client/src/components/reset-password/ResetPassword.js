import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextFieldGroup from '../common/TextFieldGroup';
import { resetPassword, checkURL } from '../../actions/auth';
import NotFound from '../not-found/NotFound'


class ResetPassword extends Component {
	state = {
		password: '',
    password2: '',
    errors: {},
	};

  componentDidMount() {
    const { id, token } = this.props.match.params;
    this.props.checkURL({ id, token })
  }

  static getDerivedStateFromProps = (nextProps) => {
    if(nextProps.errors) {
      return { errors: nextProps.errors };
    }
  };

  handleChange = e => {
    const { name, value } = e.target;
  	this.setState({
  		[name]: value,
  	});
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { password, password2 } = this.state;
    const { id, token } = this.props.match.params;

    this.props.resetPassword({ id, token, password, password2 }, this.props.history);
  }

	render() {
    const { password, password2, errors } = this.state;

		if(errors.error) {
			return <NotFound error={errors} />
		}

		return (
      <div className="forgotPassword">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Recover pasword</h1>
              <p className="lead text-center">Type in your email</p>
              <form noValidate onSubmit={this.onSubmit} >
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.handleChange}
                  error={errors.password}
                />
                <TextFieldGroup
                  placeholder="Password confirmation"
                  name="password2"
                  type="password"
                  value={password2}
                  onChange={this.handleChange}
                  error={errors.password2}
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

ResetPassword.propTypes = {
  checkURL: PropTypes.func.isRequired,
	resetPassword: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = ({ errors }) => ({ errors });

export default connect(mapStateToProps, { resetPassword, checkURL })(ResetPassword);
