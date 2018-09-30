import React from 'react';
import * as utils from 'web3-utils';
import { NotificationManager } from 'react-notifications';
import history from '~/common/history';
import 'bootstrap/dist/css/bootstrap.min.css';
import '~/assets/scss/styles.scss';
import Header from '~/Components/Header/Header';
import Subheader from '~/Components/Header/Subheader';
import Content from '~/Components/Content';
import Footer from '~/Components/Footer/Footer';
import { login, logout, loggedIn, accountDetails, retrieveSentHashes, retrieveReceivedHashes } from '~/common/loginService';
import 'react-notifications/lib/notifications.css';
import { withCookies } from 'react-cookie';



class App extends React.Component{
  constructor(){
    super();
    this.state = {
      loggedIn : false,
      balance : '',
      numTransactions : null,
      publicEthKey : '',
      dummyTransactions : [{
        timestamp : 1537220287303,
        address : '0x895B758229aFF6C0f95146A676bBF579aD7636aa',
        amount : 50.26
      },
      {
        timestamp : 1537220375766,
        address : '0xe6680987f8893F130aa2313acacb2A5eDaa9CC2B',
        amount : 10.26
        
      }],
      cookie : ''
    }
  }

  // Helper method to set state and call a callback function if it exists
  // Used for some child components to update the state without throwing a react memory leak error
  modifyAppState(state, cb){
    this.setState(()=>(Object.assign(this.state, state)), ()=>{
      console.log('updated app state', this.state);
      if(cb) cb();
    });
  }

  // Initialize Web 3 to communicate with the blockchain
  initWeb3(){
    // Check if Web 3 has been injected by the browser
    //if(typeof web3 !== 'undefined'){
    // NOT USING METAMASK FOR DCOIN, remove this later
    if(false){
      // Use Browser/metamask version
      console.log('USING METAMASK', this.web3Provider);
      this.web3Provider = web3.currentProvider;
    }else{
      console.log('USING REMOTE RPC');
      this.web3Provider = new Web3.providers.HttpProvider('http://35.237.222.172:8111');
    }

    this.web3 = new Web3(this.web3Provider);
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

  retrieveSentHashes(){console.log('!!', this.state.publicEthKey);
    return retrieveSentHashes(this.state.publicEthKey);

  }

  retrieveReceivedHashes(){
    return retrieveReceivedHashes(this.state.publicEthKey);
  }

  // WEB3 Call to get transaction data of supplied hashes from blockchain
  retrieveTransactionData(transArray){
    //console.log('rtd', transArray[0]);
    this.web3.eth.getTransaction(transArray[0], (err, data) =>{
      //console.log('in cb', data);
      return data;
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
      .then((data)=>{console.log('AUTH data', data);
        if(data.error){
          console.log('ERROR - ', data.error);
          return;
        }
        if(!data.isAuthenticated){
          console.log('ERROR -  Unable to Authenticate');
          return;
        }
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
        this.props.cookies.remove('sid');
        this.setState(()=>({loggedIn:false, account: '', cookie : ''}), ()=>{ setTimeout(()=>(history.push(`${APP_ROOT}login`)),1000);});
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

  loggedIn(){
    return loggedIn();
  }
  
  componentWillMount(){
    
    const cookie = this.props.cookies.get('sid');
    if(cookie !== undefined) {
      this.loggedIn()
      .then((data) =>{
        this.setState({loggedIn : true, publicEthKey : data.data.publicEthKey });
        this.initWeb3();
      })
      
    } 
  }

  render(){console.log('MAIN APP RENDER', this.state);
    return(
      <div>
        <Header loggedIn={ this.state.loggedIn } handleLogin={this.handleLogin.bind(this)} />
        <Subheader />
        <Content retrieveTransactionData={ this.retrieveTransactionData.bind(this) } appState={ this.state } checkLoggedIn={this.loggedIn.bind(this)} modifyAppState={this.modifyAppState.bind(this)} loggedIn={ this.state.loggedIn } handleLogin={this.handleLogin.bind(this)}  balance={this.state.balance} createNotification={this.createNotification.bind(this)} sendEther={this.sendEther.bind(this)} readTransactions={this.readTransactions.bind(this)} retrieveSentHashes={this.retrieveSentHashes.bind(this)} retrieveReceivedHashes={this.retrieveReceivedHashes.bind(this)} />
        <Footer />
      </div>
    );
  }
}

export default withCookies(App);