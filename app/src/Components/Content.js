import React from 'react';
import { Switch, Route } from 'react-router';
import { NotificationContainer } from 'react-notifications';
import TransactionTable from '~/Components/TransactionTable/TransactionTable';
import Demo from '~/Components/Demo';


export default class Content extends React.Component{
  render(){
    return(
        <div className="route_wrapper">
          <NotificationContainer />
          <Switch>
              <Route exact path={`${APP_ROOT}`} component={() => (<Demo   /> )}  />
              <Route path={`/about`} />
              <Route path={`/contact`} />
              <Route path={`/explorer`} />
              <Route path={`${APP_ROOT}transactions`} component={() => ( <TransactionTable createNotification={this.props.createNotification} dummyTransactions={this.props.dummyTransactions} /> )} />
              <Route path={`${APP_ROOT}demo`} component={() => ( <Demo sendEther={this.props.sendEther} readBalance={this.props.readBalance} />)} />
          </Switch>
        </div>
    );
  }
}