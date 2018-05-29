import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import OfferHeading from './OfferHeading';
import { Link } from 'react-router-dom';
import { getOffers } from '../../actions/career';

class Offers extends Component {
  componentDidMount() {
    this.props.getOffers();
  }

  render() {
    const { offers, loading } = this.props.career;
    let offerItems;

    if (offers === null || loading) {
      offerItems = <Spinner />;
    } else {
      if (offers.length > 0) {
        offerItems = offers.map(offer => (
          <Link style={{ textDecoration: 'none' }} key={offer._id} to={'offer/'+offer._id}>
            <OfferHeading offer={offer} />
          </Link>
        ));
      } else {
        offerItems = <h4>No offers find...</h4>;
      }
    }

    return (
      <div className="offers">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Offers</h1>
              <p className="lead text-center">
                Find your dream job!
              </p>
              {offerItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Offers.propTypes = {
  getOffers: PropTypes.func.isRequired,
  career: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  career: state.career,
});

export default connect(mapStateToProps, { getOffers })(Offers);
