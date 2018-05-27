import React from 'react';
import PropTypes from 'prop-types';

const OfferInfo = ({ offer }) => (
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
              <p>{offer.location}</p>
              <p className="text-center">{offer.user.name}</p>
              <p>
                {offer.website && (
                  <a
                    className="text-white p-2"
                    href={offer.website}
                    target="_blank"
                  >
                    <i className="fas fa-globe fa-2x" />
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
);


OfferInfo.propTypes = {
  offer: PropTypes.object.isRequired,
};

export default OfferInfo;
