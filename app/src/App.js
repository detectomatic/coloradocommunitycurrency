import React from 'react';
import * as utils from 'web3-utils';
export default class App extends React.Component{
  constructor(){
    super();
    this.state = {
      balance : ''
    }
  }
  // Initialize Web 3 to communicate with the blockchain
  initWeb3(){
    // Check if Web 3 has been injected by the browser
    if(typeof web3 !== 'undefined'){
      // Use Browser/metamask version
      this.web3Provider = web3.currentProvider;
      console.log('CURRENT WEB 3', this.web3Provider);
    }else{alert('NO WEB 3');
      //console.log('Sorry, you need metamask to use this application.');
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    this.web3 = new Web3(this.web3Provider);
    console.log('accounts',this.web3.eth.accounts);
  }

  sendEther(){
    // Get specific Eth Account
    this.web3.eth.getCoinbase((err, account) => {
      console.log(account);
      // Send 2 ether to account 2
      this.web3.eth.sendTransaction({
        from: account,
        to: '0xe6680987f8893F130aa2313acacb2A5eDaa9CC2B',
        value: '2000000000000000000'
      }, (error, hash)=>{
        console.log('sent', hash);
      });
    });
  }
  readBalance(){
    this.web3.eth.getBalance("0xe6680987f8893F130aa2313acacb2A5eDaa9CC2B", (error, wei)=>{
      if (!error) {

        var balance = utils.fromWei(wei.plus(21).toString(10), 'ether');
        this.setState(()=>({balance}));
    }

    });
  }
  
  componentWillMount(){
    this.initWeb3();
  }

  render(){
    return(
      <div>
        <h1>DCOIN Dashboard</h1>
        <button onClick={this.sendEther.bind(this)}>Send 2 Ether</button>
        <button onClick={this.readBalance.bind(this)}>Read Balance</button>
        <div>
          {this.state.balance}
        </div>
      </div>
    );
  }
}