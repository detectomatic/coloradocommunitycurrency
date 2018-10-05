// REACT
import React from 'react';
import { Switch, Route } from 'react-router';
// LIBRARIES
import PropTypes from 'prop-types';
import { NotificationContainer } from 'react-notifications';
// COMPONENTS
import TransactionTable from '~/Components/TransactionTable/TransactionTable';
import Account from '~/Components/Account/Account';
import Login from '~/Components/Login/Login';
import Register from '~/Components/Register/Register';
import Demo from '~/Components/Demo';

// COMPONENT
export default class Content extends React.Component{

  // Only render these pages if the user is logged in
  _renderUserSensitivePages(){
    if (!this.props.state.loggedIn) {
      return <Login modifyAppState={this.props.modifyAppState} loggedIn={this.props.state.loggedIn} handleLogin={this.props.handleLogin} />
    }
    return [
      <Route key="root" exact path={`${APP_ROOT}`} component={() => (<Demo retrieveReceivedHashes={this.props.retrieveReceivedHashes} retrieveSentHashes={this.props.retrieveSentHashes} sendMoney={this.props.sendMoney} readBalance={this.props.readBalance} />)}  />,
      <Route key="transactions" path={`${APP_ROOT}transactions`} component={() => (<TransactionTable retrieveTransactionData={this.props.retrieveTransactionData} retrieveReceivedHashes={this.props.retrieveReceivedHashes} retrieveSentHashes={this.props.retrieveSentHashes} createNotification={this.props.createNotification} />)} />,
      <Route key="account" path={`${APP_ROOT}account`} component={() => ( <Account email={this.props.state.email} publicEthKey={this.props.state.publicEthKey} /> )} />
    ];
  }

  // This component should only update when the action taken isn't a modal toggle
  // This resolves a bug with everything reloading every time the modal is toggled.
  shouldComponentUpdate(nextProps, nextState){
    if(this.props.state.modalOpen !== nextProps.state.modalOpen){
      return false;
    }
    return true;
  }
  
  // Render Component
  render(){
    return(
        <div className="route_wrapper">
          <NotificationContainer />
          <Switch>

              {/* About, Contact, and Explorer are all outside of the react app, so a regular link will do */}
              <Route path={`/about`} />
              <Route path={`/contact`} />
              <Route path={`/explorer`} />

              {/* Login */}
              <Route path={`${APP_ROOT}login`} component={() => ( <Login handleLogin={this.props.handleLogin} loggedIn={this.props.state.loggedIn} modifyAppState={this.props.modifyAppState} /> )} />
              {/* Register */}
              <Route path={`${APP_ROOT}register`} component={() => ( <Register modifyAppState={this.props.modifyAppState} /> )} />
              
              {/* The pages below are only accessible if the user is logged in */}
              {/* Account, Transactions, Demo */}
              { this._renderUserSensitivePages()}
              
          </Switch>
        </div>
    );
  }
}

// Prop-Types
Content.propTypes = {
  createNotification : PropTypes.func.isRequired,
  handleLogin : PropTypes.func.isRequired,
  modifyAppState : PropTypes.func.isRequired,
  retrieveTransactionData : PropTypes.func.isRequired,
  retrieveSentHashes : PropTypes.func.isRequired,
  retrieveReceivedHashes : PropTypes.func.isRequired,
  state : PropTypes.shape({
    loggedIn : PropTypes.bool.isRequired,
    publicEthKey : PropTypes.string.isRequired,
    email : PropTypes.string.isRequired,
    cookie : PropTypes.string,
    modalOpen : PropTypes.bool.isRequired
  }).isRequired
};