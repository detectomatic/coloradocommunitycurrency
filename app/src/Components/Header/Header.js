// REACT
import React from 'react';
// LIBRARIES
import PropTypes from 'prop-types';
// COMPONENTS
import Nav from './Nav';
// ASSETS
import './header.scss';
import Logo from '~/assets/images/logo.png';

// COMPONENT
export default class Header extends React.Component{

  // Render Component
  render(){
    return(
      <header>
        <div className="logo">
          <img src={Logo} />
        </div>
        <Nav handleLogin={ this.props.handleLogin } loggedIn={ this.props.loggedIn } toggleModal={ this.props.toggleModal }  />
      </header>
    );
  }
}

Header.propTypes = {
  handleLogin : PropTypes.func.isRequired,
  loggedIn : PropTypes.bool.isRequired,
  toggleModal : PropTypes.func.isRequired
}