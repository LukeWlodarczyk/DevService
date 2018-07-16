import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import NotFound from '../not-found/NotFound'
import Spinner from '../common/Spinner';
import OfferHeading from './OfferHeading';
import OfferDetails from './OfferDetails';
import { getOffer, deleteOffer } from '../../actions/career';

class Offer extends Component {
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getOffer(this.props.match.params.id);
    }
  }

  deleteOffer = () => {
    this.props.deleteOffer(this.props.match.params.id, this.props.history);
  }

  render() {
    const { career: { offer, loading }, auth } = this.props;
    let offerContent;

    if (offer.error) {
      return <NotFound error={offer} />
    }

    if (!Object.keys(offer).length || loading) {
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
          <OfferHeading offer={offer} auth={auth} deleteOffer={this.deleteOffer} displayActions={true} />
          <OfferDetails offer={offer} />
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
  career: state.career,
  auth: state.auth,
});

export default connect(mapStateToProps, { getOffer, deleteOffer })(Offer);
