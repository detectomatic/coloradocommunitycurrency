// REACT
import React from 'react';
import { Switch, Route } from 'react-router';
// LIBRARIES
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
  renderUserSensitivePages(){
    if (!this.props.loggedIn) {
      return <Login modifyAppState={this.props.modifyAppState} loggedIn={this.props.loggedIn} handleLogin={this.props.handleLogin} />
    }
    return [
      <Route key="root" exact path={`${APP_ROOT}`} component={() => (<Demo retrieveReceivedHashes={this.props.retrieveReceivedHashes} retrieveSentHashes={this.props.retrieveSentHashes} sendMoney={this.props.sendMoney} readBalance={this.props.readBalance} />)}  />,
      <Route key="transactions" path={`${APP_ROOT}transactions`} component={() => (<TransactionTable retrieveTransactionData={this.props.retrieveTransactionData} retrieveReceivedHashes={this.props.retrieveReceivedHashes} retrieveSentHashes={this.props.retrieveSentHashes} createNotification={this.props.createNotification} />)} />,
      <Route key="account" path={`${APP_ROOT}account`} component={() => ( <Account createNotification={this.props.createNotification} email={this.props.state.email} publicEthKey={this.props.state.publicEthKey} /> )} />
    ];
  }

  // This component should only update when the action taken isn't a modal toggle
  // This resolves a bug with everything reloading every time the modal is toggled.
  shouldComponentUpdate(nextProps, nextState){
    if(this.props.modalOpen !== nextProps.modalOpen){
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
              <Route path={`${APP_ROOT}login`} component={() => ( <Login modifyAppState={this.props.modifyAppState} loggedIn={this.props.loggedIn} handleLogin={this.props.handleLogin} /> )} />
              {/* Register */}
              <Route path={`${APP_ROOT}register`} component={() => ( <Register modifyAppState={this.props.modifyAppState} /> )} />
              
              {/* The pages below are only accessible if the user is logged in */}
              {/* Account, Transactions, Demo */}
              { this.renderUserSensitivePages()}
              
          </Switch>
        </div>
    );
  }
}