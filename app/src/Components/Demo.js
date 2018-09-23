import React from 'react';

export default class Demo extends React.Component{
  render(){
    return(
      <div>
        <h1>DCOIN Dashboard</h1>
        <button className="btn btn-primary" onClick={this.props.sendEther}>Send 2 Ether</button>
        <button className="btn btn-secondary" onClick={this.props.readBalance}>Read Balance</button>
        <div>
          {this.props.balance}
        </div>
      </div>
    )
  }
}