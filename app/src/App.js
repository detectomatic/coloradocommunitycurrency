import React from 'react';
import * as utils from 'web3-utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import '~/assets/scss/styles.scss';
import Header from '~/Components/Header/Header';
import Subheader from '~/Components/Header/Subheader';
import TransactionTable from '~/Components/TransactionTable/TransactionTable';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

export default class App extends React.Component{
  constructor(){
    super();
    this.state = {
      balance : '',
      numTransactions : null,
      dummyTransactions : [{
        timestamp : 1537220287303,
        address : '0x895B758229aFF6C0f95146A676bBF579aD7636aa',
        amount : 50.26
      },
      {
        timestamp : 1537220375766,
        address : '0xe6680987f8893F130aa2313acacb2A5eDaa9CC2B',
        amount : 10.26
        
      }]
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
    console.log(this.web3.eth.accounts);
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
    this.web3.eth.getTransaction('0x2de1d12d0785196767d90043635fc5c1e2c6d276e604b2dc5ef217a6fd8d7cdb', (error, data) =>{
      console.log('D',data);
    });
  }

  readTransactions(){
    this.web3.eth.getTransactionsByAccount();
  }
  createNotification(type, message){
    switch (type) {
      case 'info':
        NotificationManager.info(message);
        break;
      case 'success':
        NotificationManager.success(message, 'Success!', 1200);
        break;
      case 'warning':
        NotificationManager.warning(message, 'Close after 3000ms', 3000);
        break;
      case 'error':
        NotificationManager.error(message, 'Click me!', 3000);
        break;
    }
  }
  
  componentWillMount(){
    this.initWeb3();
  }

  render(){
    return(
      <div>
        <Header />
        <Subheader />
        <TransactionTable createNotification={this.createNotification.bind(this)} dummyTransactions={this.state.dummyTransactions} />
        <NotificationContainer />
        <h1>DCOIN Dashboard</h1>
        <button className="btn btn-primary" onClick={this.sendEther.bind(this)}>Send 2 Ether</button>
        <button className="btn btn-secondary" onClick={this.readBalance.bind(this)}>Read Balance</button>
        <div>
          {this.state.balance}
        </div>
      </div>
    );
  }
}