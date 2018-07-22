import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { setCurrentUser, logoutUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import { clearCurrentProfile } from './actions/profile';

import { Provider } from 'react-redux';
import store from './store';

import PrivateRoute from './components/common/PrivateRoute';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import EmailVerification from './components/auth/EmailVerification';
import Dashboard from './components/dashboard/Dashboard';
import EditProfile from './components/edit-profile/EditProfile';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import AddOffer from './components/career/AddOffer';
import Offer from './components/career/Offer';
import Offers from './components/career/Offers';
import ForgotPassword from './components/reset-password/ForgotPassword';
import ResetPassword from './components/reset-password/ResetPassword';
import Success from './components/common/Success';

import './App.css';

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentProfile());
    window.location.href = '/login';
  };
};

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path='/' component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route path="/login/forgot" component={ForgotPassword} />
              <Route path="/login/reset_password/:id/:token" component={ResetPassword} />
              <Route path="/register/verify_email/:id/:token" component={EmailVerification} />
              <Route path="/profiles" component={Profiles} />
              <Route path="/profile/:username" component={Profile} />
              <Route path="/success" component={Success} />
              <Switch>
                <PrivateRoute path="/dashboard" component={Dashboard} />
                <PrivateRoute path="/edit-profile" component={EditProfile} />
                <PrivateRoute path="/add-experience" component={AddExperience} />
                <PrivateRoute path="/add-education" component={AddEducation} />
                <PrivateRoute path="/feed" component={Posts} />
                <PrivateRoute path="/post/:id" component={Post} />
                <PrivateRoute path="/offers" component={Offers} />
                <PrivateRoute path="/add-job" component={AddOffer} />
                <PrivateRoute exact path="/offer/:id" component={Offer} />
                <PrivateRoute path="/offer/:id/edit" component={AddOffer} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
