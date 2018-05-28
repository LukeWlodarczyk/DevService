import React from 'react';
import PropTypes from 'prop-types';

const OfferHeading = ({ offer }) => (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="text-center">
              <h1 className="lead text-center">
                {offer.position}{' '}
                {offer.company && (
                  <span>at {offer.company}</span>
                )}
              </h1>
              <p className="mb-0">{offer.location}</p>
            </div>
          </div>
        </div>
      </div>
);


OfferHeading.propTypes = {
  offer: PropTypes.object.isRequired,
};

export default OfferHeading;
