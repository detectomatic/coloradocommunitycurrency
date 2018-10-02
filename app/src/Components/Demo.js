import React from 'react';

export default class Demo extends React.Component{
  render(){console.log('PS', this.props);
    return(
      <div>
        <h1>DCOIN Dashboard</h1>
        <button className="btn btn-primary" onClick={this.props.sendMoney}>Send 2 Ether</button>
        <button className="btn btn-secondary" onClick={this.props.readBalance}>Read Balance</button>
        <button className="btn btn-secondary" onClick={this.props.checkLoggedIn}>Logged In</button>
        <button className="btn btn-secondary" onClick={this.props.retrieveSentHashes}>Sent Hashes</button>
        <button className="btn btn-secondary" onClick={this.props.retrieveReceivedHashes}>Received Hashes</button>
        <div>
          {this.props.balance}
        </div>
      </div>
    )
  }
}