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
  requireAuth(){
    if (!authenticated) {
      replace({
        pathname: "/login",
        state: {nextPathname: nextState.location.pathname}
      });
    }
    next();
  }

  shouldComponentUpdate(nextProps, nextState){
    if(this.props.modalOpen !== nextProps.modalOpen){
      return false;
    }
    return true;
  }
  

  render(){
    return(
        <div className="route_wrapper">
          <NotificationContainer />
          <Switch>
              <Route exact path={`${APP_ROOT}`} component={() => (<Demo retrieveReceivedHashes={this.props.retrieveReceivedHashes} retrieveSentHashes={this.props.retrieveSentHashes} sendMoney={this.props.sendMoney} readBalance={this.props.readBalance} checkLoggedIn={this.props.checkLoggedIn} />)} /> )}  />
              <Route path={`/about`} />
              <Route path={`/contact`} />
              <Route path={`/explorer`} />
              <Route path={`${APP_ROOT}transactions`} 
                component={() => (
                  this.props.loggedIn ? 
                    <TransactionTable retrieveTransactionData={this.props.retrieveTransactionData} retrieveReceivedHashes={this.props.retrieveReceivedHashes} retrieveSentHashes={this.props.retrieveSentHashes} createNotification={this.props.createNotification} /> 
                  : <Login modifyAppState={this.props.modifyAppState} loggedIn={this.props.loggedIn} handleLogin={this.props.handleLogin} />
                  
                )} 
              />
              <Route path={`${APP_ROOT}account`} component={() => ( <Account createNotification={this.props.createNotification} email={this.props.state.email} publicEthKey={this.props.state.publicEthKey} /> )} />
              <Route path={`${APP_ROOT}login`} component={() => ( <Login modifyAppState={this.props.modifyAppState} loggedIn={this.props.loggedIn} handleLogin={this.props.handleLogin} /> )} />
              <Route path={`${APP_ROOT}register`} component={() => ( <Register modifyAppState={this.props.modifyAppState} /> )} />
              <Route path={`${APP_ROOT}demo`} component={() => ( <Demo retrieveReceivedHashes={this.props.retrieveReceivedHashes} retrieveSentHashes={this.props.retrieveSentHashes} sendMoney={ this.sendMoney } readBalance={this.props.readBalance} checkLoggedIn={this.props.checkLoggedIn} />)} />
          </Switch>
        </div>
    );
  }
}