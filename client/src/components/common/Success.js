import React from 'react';
import PropTypes from 'prop-types';

const Success = ({ location }) => (
    <div>
      <h1 className="display-4">Success</h1>
      <p>{location.state ? location.state.message : 'Operation succeeded!'}</p>
    </div>
  );


Success.propTypes = {
  location: PropTypes.object,
};

export default Success;
