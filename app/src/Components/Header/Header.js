// REACT
import React from 'react';
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
        <Nav toggleModal={ this.props.toggleModal } loggedIn={ this.props.loggedIn } handleLogin={ this.props.handleLogin } />
      </header>
    );
  }
}