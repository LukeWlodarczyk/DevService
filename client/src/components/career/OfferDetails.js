import React from 'react';
import PropTypes from 'prop-types';

const OfferDetails = ({ offer }) => (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            <div>
              <h3 className="text-center text-info">Requirements</h3>
              <div className="row d-flex flex-wrap justify-content-center align-items-center mb-3">
                {
                  offer.requirements.map((skill, index) => (
                    <div key={index} className="p-3">
                      <i className="fa fa-check" /> {skill}
                    </div>
                  ))
                }
              </div>
            </div>

            <div>
              <h3 className="text-center text-info">Languages</h3>
              <div className="row d-flex flex-wrap justify-content-center align-items-center mb-3">
                {
                  offer.languages.map((item, index) => (
                    <div key={index} className="p-3">
                      <i className="fa fa-check" /> {item}
                    </div>
                  ))
                }
              </div>
            </div>

            <div>
              <h3 className="text-center text-info">Nice to have</h3>
              <div className="row d-flex flex-wrap justify-content-center align-items-center mb-3">
                {
                  offer.niceToHave.map((skill, index) => (
                    <div key={index} className="p-3">
                      <i className="fa fa-check" /> {skill}
                    </div>
                  ))
                }
              </div>
            </div>

            <div>
              <h3 className="text-center text-info">We can offer you</h3>
              <div className="row d-flex flex-wrap justify-content-center align-items-center">
                {
                  offer.canOffer.map((item, index) => (
                    <div key={index} className="p-3">
                      <i className="fa fa-check" /> {item}
                    </div>
                  ))
                }
              </div>
            </div>

          </div>

          <div className="card card-body bg-info text-white mb-3">
            <div className="text-center">
              <p className="mb-0">{offer.description}</p>
            </div>
          </div>
        </div>
      </div>
    );


OfferDetails.propTypes = {
  offer: PropTypes.object.isRequired,
};

export default OfferDetails;
