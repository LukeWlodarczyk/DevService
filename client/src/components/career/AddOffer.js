import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import NotFound from '../not-found/NotFound';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { clearErrors } from '../../actions/profile';
import { addOffer, editOffer, getOffer } from '../../actions/career';

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
			errors: {},
		};
	}

	componentDidMount() {
		if (!this.props.isVerified) {
			this.props.history.push('/dashboard');
		}

		if (Object.keys(this.props.errors).length !== 0) {
			this.props.clearErrors();
		}

		if (this.props.match.params.id) {
			this.props.getOffer(this.props.match.params.id);
		}
	}

	static getDerivedStateFromProps(nextProps) {
		if (Object.keys(nextProps.errors).length) {
			nextProps.clearErrors();
			return {
				errors: nextProps.errors,
			};
		}

		if (nextProps.match.params.id && Object.keys(nextProps.offer).length) {
			let { _id, user, ...data } = nextProps.offer;

			for (const key in data) {
				if (Array.isArray(data[key])) {
					data[key] = data[key].join(', ');
				}
				data[key] = data[key];
			}
			return {
				...data,
			};
		}

		return null;
	}

	onSubmit = e => {
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
		};

		if (this.props.match.params.id) {
			offerData.id = this.props.match.params.id;
			return this.props.editOffer(offerData, this.props.history);
		}

		this.props.addOffer(offerData, this.props.history);
	};

	onChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	render() {
		const { errors } = this.state;
		const { id } = this.props.match.params;

		const url = id ? `/offer/${id}` : '/dashboard';

		if (this.props.offer.error) {
			return <NotFound error={this.props.offer} />;
		}

		return (
			<div className="edit-profile">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<Link to={url} className="btn btn-light">
								Go Back
							</Link>
							<h1 className="display-4 text-center">
								{this.props.match.params.id ? 'Edit offer' : 'Add offer'}
							</h1>
							<small className="d-block pb-3">* = required fields</small>
							<form onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="* Position"
									name="position"
									value={this.state.position}
									onChange={this.onChange}
									error={errors.position}
								/>
								<TextFieldGroup
									placeholder="* Company"
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
									placeholder="* Email"
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
									placeholder="* Location"
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
                    HTML,CSS,JavaScript,PHP)"
								/>
								<TextFieldGroup
									placeholder="* What can you offer?"
									name="canOffer"
									value={this.state.canOffer}
									onChange={this.onChange}
									error={errors.canOffer}
									info="Please use comma separated values (eg.
                    Private health care, Play room, Kitchen)"
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
									placeholder="* Languages"
									name="languages"
									value={this.state.languages}
									onChange={this.onChange}
									error={errors.languages}
									info="Please use comma separated values"
								/>
								<TextAreaFieldGroup
									placeholder="* Description"
									name="description"
									value={this.state.description}
									onChange={this.onChange}
									error={errors.description}
								/>
								<input
									type="submit"
									value="Submit"
									className="btn btn-info btn-block mt-4"
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
	editOffer: PropTypes.func.isRequired,
	getOffer: PropTypes.func.isRequired,
	clearErrors: PropTypes.func.isRequired,
	offer: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	offer: state.career.offer,
	errors: state.errors,
	isVerified: state.auth.user.isVerified,
});

export default connect(
	mapStateToProps,
	{ addOffer, editOffer, getOffer, clearErrors }
)(AddOffer);
