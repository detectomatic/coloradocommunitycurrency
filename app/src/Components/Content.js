import React from 'react';
import TransactionTable from '~/Components/TransactionTable/TransactionTable';
import { NotificationContainer } from 'react-notifications';

export default class Content extends React.Component{
  render(){
    return(
        <div>
          <TransactionTable createNotification={this.props.createNotification} dummyTransactions={this.props.dummyTransactions} />
          <NotificationContainer />
          <h1>DCOIN Dashboard</h1>
          <button className="btn btn-primary" onClick={this.props.sendEther}>Send 2 Ether</button>
          <button className="btn btn-secondary" onClick={this.props.readBalance}>Read Balance</button>
          <div>
            {this.props.balance}
          </div>
        </div>
    );
  }
}