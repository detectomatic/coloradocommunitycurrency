import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './header.scss';

export default class Nav extends React.Component{

  // If logged in, render account button, otherwise render getting started button
  renderGettingStarted(){
    if(this.props.loggedIn){
        return (
            <span className="account">
                <a onClick={this.handleToggle.bind(this)} title="Account">
                <FaUserCircle/>
                </a>
                <div onClick={this.handleToggle.bind(this)} className={`account_dropdown ${this.state.open ? ' dropdown_open' : ' dropdown_closed' }`}>
                    <ul>
                        <li>
                            <NavLink to={`${APP_ROOT}account`} className="nav-link" activeClassName="active">Account</NavLink>
                        </li>
                        <li>
                            <a className="nav-link" onClick={this.handleLogout.bind(this)}>Logout</a>
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

  render(){
    return(
      <ul className="nav">
        <li className="nav-item">
          <a className="nav-link" href="/about">About</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/contact">Contact</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/explorer">Explorer</a>
        </li>
        <li className="nav-item">
          <NavLink to={`${APP_ROOT}transactions`} className="nav-link" activeClassName="active">Transactions</NavLink>
        </li>
        <li className="nav-item">
          { this.renderGettingStarted() }
        </li>
      </ul>
    );
  }
}