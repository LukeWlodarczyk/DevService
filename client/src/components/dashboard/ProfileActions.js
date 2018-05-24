import React from 'react';
import { Link } from 'react-router-dom';

const ProfileActions = () => (
    <div className="btn-group-sm mb-4" role="group">
      <Link to="/edit-profile" className="btn btn-light">
        <i className="fas fa-user-circle text-info mr-1" /> Edit Profile
      </Link>
      <Link to="/add-experience" className="btn btn-light">
        <i className="fab fa-black-tie text-info mr-1" />
        Add Experience
      </Link>
      <Link to="/add-education" className="btn btn-light">
        <i className="fas fa-graduation-cap text-info mr-1" />
        Add Education
      </Link>
      <Link to="/add-job" className="btn d-sm-inline btn-light">
        <i className="fas fa-briefcase text-info mr-1" />
        Add job offer
      </Link>
    </div>
);


export default ProfileActions;
