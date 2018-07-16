import React from 'react';

export default ({ error }) => (
    <div>
      <h1 className="display-4">Page Not Found</h1>
      {error && <p>{error.message}.</p>}
    </div>
  );
