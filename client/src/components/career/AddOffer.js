import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import { addOffer, getCurrentOffer, clearErrors } from '../../actions/profile';

class AddOffer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: '',
      email: '',
      website: '',
      location: '',
      phoneNumber: '',
      position: '',
      requirements: '',
      niceToHave: '',
      description: '',
      languages: '',
      canOffer: '',
      errors: {}
    };
  }

  componentDidMount() {
    if(this.props.profile.profile === null) {
      return this.props.history.push('/dashboard');
    }
    if(Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
    this.props.getCurrentOffer();
  }

  static getDerivedStateFromProps = (nextProps) => {
    if(Object.keys(nextProps.errors).length || nextProps.profile.profile) {
      const profile = nextProps.profile.profile;
      const skills = profile.skills.join(',');
      return {
        errors: nextProps.errors,
        ...profile,
        ...profile.social,
        skills,
      }
    }

    return null;

  };

  onSubmit = (e) => {
    e.preventDefault();

    const offerData = {
      company: this.state.company,
      email: this.state.email,
      website: this.state.website,
      location: this.state.location,
      phoneNumber: this.state.phoneNumber,
      position: this.state.position,
      requirements: this.state.requirements,
      niceToHave: this.state.niceToHave,
      description: this.state.description,
      languages: this.state.languages,
      canOffer: this.state.canOffer,
    }

    this.props.addOffer(offerData, this.props.history);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }


  render() {
    const { errors } = this.state;

    const options = [
      { label: '* Select Professional Status', value: 0 },
      { label: 'Developer', value: 'Developer' },
      { label: 'Junior Developer', value: 'Junior Developer' },
      { label: 'Senior Developer', value: 'Senior Developer' },
      { label: 'Manager', value: 'Manager' },
      { label: 'Student or Learning', value: 'Student or Learning' },
      { label: 'Instructor or Teacher', value: 'Instructor or Teacher' },
      { label: 'Intern', value: 'Intern' },
      { label: 'Other', value: 'Other' }
    ];

    return (
      <div className="edit-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Edit Profile</h1>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Position"
                  name="position"
                  value={this.state.position}
                  onChange={this.onChange}
                  error={errors.position}
                />
                <TextFieldGroup
                  placeholder="Company"
                  name="company"
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.company}
                />
                <TextFieldGroup
                  placeholder="Website"
                  name="website"
                  value={this.state.website}
                  onChange={this.onChange}
                  error={errors.website}
                />
                <TextFieldGroup
                  placeholder="Email"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />
                <TextFieldGroup
                  placeholder="Phone number"
                  name="phoneNumber"
                  value={this.state.phoneNumber}
                  onChange={this.onChange}
                  error={errors.phoneNumber}
                />
                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                  info="City or city & state suggested (eg. Boston, MA)"
                />
                <TextFieldGroup
                  placeholder="* Required skills"
                  name="requirements"
                  value={this.state.requirements}
                  onChange={this.onChange}
                  error={errors.requirements}
                  info="Please use comma separated values (eg.
                    HTML,CSS,JavaScript,PHP"
                />
                <TextFieldGroup
                  placeholder="What can you offer?"
                  name="canOffer"
                  value={this.state.canOffer}
                  onChange={this.onChange}
                  error={errors.canOffer}
                  info="Please use comma separated values (eg.
                    Private health care, Play room, Kitchen"
                />
                <TextFieldGroup
                  placeholder="Nice to have"
                  name="niceToHave"
                  value={this.state.niceToHave}
                  onChange={this.onChange}
                  error={errors.niceToHave}
                  info="Please use comma separated values"
                />
                <TextFieldGroup
                  placeholder="Languages"
                  name="languages"
                  value={this.state.languages}
                  onChange={this.onChange}
                  error={errors.languages}
                  info="Please use comma separated values"
                />
                <TextFieldGroup
                  placeholder="Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddOffer.propTypes = {
  addOffer: PropTypes.func.isRequired,
  getCurrentOffer: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  offer: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  offer: state.career.offer,
  errors: state.errors
});

export default connect(mapStateToProps, { addOffer, getCurrentOffer, clearErrors })(AddOffer);
