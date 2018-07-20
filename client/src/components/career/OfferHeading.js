import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const OfferHeading = ({ offer, auth, displayActions, deleteOffer }) => (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3 position-relative">
            {(displayActions && offer.user ? offer.user._id : 'deleted' === auth.user.id) ? (
              <div className="position-absolute">
                <button
                  onClick={deleteOffer}
                  type="button"
                  className="btn btn-danger"
                >
                  <i className="fas fa-times" />
                </button>
                <Link
                  to={'/offer/'+offer._id+'/edit'}
                  className="btn btn-success d-block mt-2"
                >
                  <i className="fas fa-pen-square" />
                </Link>
              </div>
            ) : null}
            <div className="mx-5 text-center">
              <small>{new Date(offer.date).toLocaleDateString()}</small>
              <h1 className="lead text-center">
                {offer.position} at {offer.company}
              </h1>
              <p className="mb-0">{offer.location}</p>
            </div>
          </div>
        </div>
      </div>
);


OfferHeading.propTypes = {
  deleteOffer: PropTypes.func,
  offer: PropTypes.object.isRequired,
  auth: PropTypes.object,
  displayActions: PropTypes.bool,
};

OfferHeading.defaultProps = {
  displayActions: false,
};

export default OfferHeading;
