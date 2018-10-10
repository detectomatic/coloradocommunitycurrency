// REACT
import React from 'react';
import { NavLink } from 'react-router-dom';
// LIBRARES
import PropTypes from 'prop-types';
import { FaUserCircle } from 'react-icons/fa';
// ASSETS
import './header.scss';

// COMPONENT
export default class Nav extends React.Component{
  constructor(){
    super();
    // Component state handles subnav functionality
    this.state = {
        open: false,
    };
  }

  // Sets state that toggles the open / close of the account subnav
  _handleToggle() {
    return this.setState(state => ({ open: !this.state.open }));
  };

  // Handles logging out and navigating to account page
  _handleLogout(e){
    e.preventDefault();
    this._handleToggle();
    this.props.handleLogin(false);
  }

  // If logged in, render account button, otherwise render getting started button
  _renderGettingStarted(){
    if(this.props.loggedIn){
      return (
        <span className="account">
          <NavLink to={`${APP_ROOT}account`} className={ this.state.open ? 'subnav_open nav-link' : 'nav-link' } onMouseEnter={this._handleToggle.bind(this)} title="Account" activeClassName="active">
            <FaUserCircle/>
          </NavLink>
          <div onClick={this._handleToggle.bind(this)} className={`account_dropdown ${this.state.open ? ' dropdown_open' : ' dropdown_closed' }`}>
            <ul>
              <li>
                <NavLink to={`${APP_ROOT}account`} className="nav-link" activeClassName="active">Account</NavLink>
              </li>
              <li>
                <a className="nav-link" onClick={this._handleLogout.bind(this)}>Logout</a>
              </li>
            </ul>
            <div className="arrow_up"></div>
          </div>
        </span>
      );
    }else{
      return <NavLink to={`${APP_ROOT}register`} activeClassName="active" className="nav-link btn btn-small">Get Started</NavLink>;
    }
}

  // Render Component
  render(){
    return(
      <nav className="nav-wrapper" onMouseLeave={()=>{this.setState({open : false})}}>
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link" href="/about">About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/contact">Contact</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/explorer">Block Explorer</a>
          </li>
          <li className="nav-item">
            <NavLink to={`${APP_ROOT}transactions`} className="nav-link" activeClassName="active">Transactions</NavLink>
          </li>
          <li className="nav-item">
            <a className={this.props.loggedIn ? 'nav-link' : 'nav-link disabled'} onClick={ this.props.toggleModal }>Send DCoin</a>
          </li>
          <li className="nav-item">
            { this._renderGettingStarted() }
          </li>
        </ul>
      </nav>
    );
  }
}

Nav.propTypes = {
  handleLogin : PropTypes.func.isRequired,
  loggedIn : PropTypes.bool.isRequired,
  toggleModal : PropTypes.func.isRequired
}