import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './header.scss';

export default class Nav extends React.Component{

  constructor(){
    super();
    this.state = {
        open: false,
    };
}

  // Sets state that toggles the open / close of the account subnav
  handleToggle() {
      return this.setState(state => ({ open: !this.state.open }));
  };

  // Handles logging out and navigating to account page
  handleLogout(e){
      e.preventDefault();
      this.handleToggle();
      this.props.handleLogin(false);
  }

  // If logged in, render account button, otherwise render getting started button
  renderGettingStarted(){
    if(this.props.loggedIn){
        return (
            <span className="account">
       
                <NavLink to={`${APP_ROOT}account`} className={ this.state.open ? 'subnav_open nav-link' : 'nav-link' } onMouseEnter={this.handleToggle.bind(this)} title="Account" activeClassName="active">
                    <FaUserCircle/>
                </NavLink>
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
        <nav className="nav-wrapper" onMouseLeave={()=>{this.setState({open : false})}}>
            {/* <div onClick={this.handleToggle.bind(this)} className={`opaque-backdrop ${this.state.open ? 'backdrop-visible' : 'backdrop-hidden'}`}></div> */}
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
        </nav>
    );
  }
}