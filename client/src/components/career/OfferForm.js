import React, { Component } from 'react'
import { connect } from 'react-redux';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import { sendApplication } from '../../actions/career';
import TextFieldGroup from '../common/TextFieldGroup';


class OfferForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      subject: '',
      email: '',
      errors: {}
    };
  }

  static getDerivedStateFromProps = (nextProps) => {
    if(nextProps.errors) {
      return { errors: nextProps.errors };
    }
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { message, subject, email } = this.state;

    this.props.sendApplication({ message, subject, email, offerId: this.props.id }, this.props.history);

  }

  handleChange = e => {
    const { name, value } = e.target;
  	this.setState({
  		[name]: value,
  	});
  };

  render() {
    const { errors, message, subject, email } = this.state;

    return (
      <form noValidate onSubmit={this.onSubmit}>
        <div className="form-group">
          <TextFieldGroup
            placeholder="Your email"
            name="email"
            type="email"
            value={email}
            onChange={this.handleChange}
            error={errors.email}
          />
          <TextFieldGroup
            placeholder="Subject"
            name="subject"
            type="text"
            value={subject}
            onChange={this.handleChange}
            error={errors.subject}
          />
          <TextAreaFieldGroup
            placeholder="Some message"
            name="message"
            value={message}
            onChange={this.handleChange}
            error={errors.message}
          />
        </div>
        <button type="submit" className="btn btn-dark">
          Send application
        </button>
      </form>
    );
  }
}

const mapStateToProps = ({ errors, auth: { user }}) => ({ errors, user })

export default connect(mapStateToProps, { sendApplication })(OfferForm);
