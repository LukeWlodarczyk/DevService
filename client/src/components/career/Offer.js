import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Spinner from '../common/Spinner';
import OfferInfo from './OfferInfo';
import { getOffer } from '../../actions/career';

class Offer extends Component {
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getOffer(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.career.offer === null && this.props.career.loading) {
      this.props.history.push('/not-found');
    }
  }

  render() {
    const { offer, loading } = this.props.career;
    let offerContent;

    if (offer === null || !Object.keys(offer).length || loading) {
      offerContent = <Spinner />;
    } else {
      offerContent = (
        <div>
          <div className="row">
            <div className="col-md-6">
              <Link to="/offers" className="btn btn-light mb-3 float-left">
                Back To Offers
              </Link>
            </div>
            <div className="col-md-6" />
          </div>
          <OfferInfo offer={offer} />
        </div>
      );
    }

    return (
      <div className="profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{offerContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

Offer.propTypes = {
  getOffer: PropTypes.func.isRequired,
  career: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  career: state.career
});

export default connect(mapStateToProps, { getOffer })(Offer);
