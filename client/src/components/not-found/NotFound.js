import React from 'react';
import PropTypes from 'prop-types';

const NotFound = ({ error }) => (
    <div>
      <h1 className="display-4">Page Not Found</h1>
      {error && <p>{error.message}.</p>}
    </div>
  );


NotFound.propTypes = {
  error: PropTypes.object
};

export default NotFound;
