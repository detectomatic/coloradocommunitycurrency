import React from 'react';
import * as utils from 'web3-utils';
import { NotificationManager } from 'react-notifications';
import 'bootstrap/dist/css/bootstrap.min.css';
import '~/assets/scss/styles.scss';
import Header from '~/Components/Header/Header';
import Subheader from '~/Components/Header/Subheader';
import Content from '~/Components/Content';
import Footer from '~/Components/Footer/Footer';
import { login, logout, loggedIn, accountDetails } from '~/common/loginService';
import 'react-notifications/lib/notifications.css';



export default class App extends React.Component{
  constructor(){
    super();
    this.state = {
      loggedIn : false,
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

  // Handle login to node backend on google cloud
  handleLogin(doLogin, email, password){
    //console.log(email, password);
    if(doLogin){
      return login({ email, password })
      .then((data)=>{
        if(data.error){
          console.log('ERROR - ', data.error);
          return;
        }
        //console.log('THE DATA', data);
        return data;
      })
      .catch((error)=>{
        console.log('log out failure', error);
      });
      
    }else if(doLogin === false){
      return logout()
      .then((data)=>{
        //console.log('Data', data);
        if(data.error){
          console.log('ERROR - ', data.error);
          return;
        }
        this.setState(()=>({loggedIn:false, account: ''}), ()=>{ setTimeout(()=>(history.push(`${APP_ROOT}login`)),1000);});
      })
      .catch((error)=>{
        console.log('log out failure', error);
      });
    }
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
        <Header loggedIn={ this.state.loggedIn } handleLogin={this.handleLogin.bind(this)} />
        <Subheader />
        <Content balance={this.state.balance} dummyTransactions={this.state.dummyTransactions} createNotification={this.createNotification.bind(this)} sendEther={this.sendEther.bind(this)} readTransactions={this.readTransactions.bind(this)} />
        <Footer />
      </div>
    );
  }
}