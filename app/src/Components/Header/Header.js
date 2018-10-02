import React from 'react';
import Nav from './Nav';
import './header.scss';
import Logo from '~/assets/images/logo.png';

export default class Header extends React.Component{

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