import React from 'react';
import { withRouter } from 'react-router';
import * as utils from 'web3-utils';
//import { utils, providers } from 'web3';
import { NotificationManager } from 'react-notifications';
import history from '~/common/history';
import 'bootstrap/dist/css/bootstrap.min.css';
import '~/assets/scss/styles.scss';
import Header from '~/Components/Header/Header';
import Subheader from '~/Components/Header/Subheader';
import Content from '~/Components/Content';
import Footer from '~/Components/Footer/Footer';
import Modal from '~/Components/Modal/Modal';
//import Modal from 'react-bootstrap/lib/Modal';
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
      cookie : '',
      modalOpen : false
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
    if(typeof web3 !== 'undefined'){
    // NOT USING METAMASK FOR DCOIN, remove this later
    //if(true){
      // Use Browser/metamask version
      this.web3Provider = web3.currentProvider;
      console.log('USING METAMASK', this.web3Provider);
    }else{
      console.log('USING REMOTE RPC');
      this.web3Provider = new Web3.providers.HttpProvider('http://35.237.222.172:8111');
      console.log('web3 provider',this.web3Provider);
    }

    this.web3 = new Web3(this.web3Provider);
    console.log('web3', this.web3);
    console.log('is connected ',this.web3.isConnected());

 
  }

  sendMoney(address, amount){
    console.log(this.web3);
    // Get specific Eth Account
    this.web3.eth.getCoinbase((err, account) => {
      console.log('ACC',account);
      // Send 2 ether to account 2
      this.web3.eth.sendTransaction({
        from: account,
        to: address,
        value: amount
      }, (error, hash)=>{
        console.log('sent', hash);
      });
    });
  }
  readBalance(){
    this.web3.eth.getBalance("0x895b758229aff6c0f95146a676bbf579ad7636aa", (error, wei)=>{
      if (!error) {
        
        var balance = utils.fromWei(wei.plus(21).toString(10), 'ether');
        console.log('wei', wei.toString(), 'ether',utils.fromWei(wei.toString(), 'ether'));
        this.setState(()=>({balance}));
    }

    });
    this.web3.eth.getTransaction('0x2de1d12d0785196767d90043635fc5c1e2c6d276e604b2dc5ef217a6fd8d7cdb', (error, data) =>{
      console.log('D',data);
    });
  }

  retrieveSentHashes(){
    return retrieveSentHashes(this.state.publicEthKey);

  }

  retrieveReceivedHashes(){
    return retrieveReceivedHashes(this.state.publicEthKey);
  }

  // WEB3 Call to get transaction data of supplied hashes from blockchain
  retrieveTransactionData(transArray){
    //console.log('TA',transArray);
    const promiseArray = transArray.map((p, i)=>{
      
      if(i <= 5){
        return new Promise((resolve, reject)=>{
          this.web3.eth.getTransaction(transArray[i], (err, data) =>{
            if(err){
              console.log('ERR', err);
              reject(err);
            }
            resolve(data);
          });
        });
      }
      
    });


    console.log('pa', promiseArray);
    return Promise.all(promiseArray)
    .then((values) =>{
      return values;
    });

    

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

  toggleModal(){
    this.setState({ modalOpen : !this.state.modalOpen });
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



  render(){
    return(
      <div>
        <Header toggleModal={ this.toggleModal.bind(this) } loggedIn={ this.state.loggedIn } handleLogin={this.handleLogin.bind(this)} />
        <Subheader />
        <Content modalOpen={ this.state.modalOpen } retrieveTransactionData={ this.retrieveTransactionData.bind(this) } checkLoggedIn={this.loggedIn.bind(this)} modifyAppState={this.modifyAppState.bind(this)} loggedIn={ this.state.loggedIn } handleLogin={this.handleLogin.bind(this)}  balance={this.state.balance} createNotification={this.createNotification.bind(this)} sendMoney={this.sendMoney.bind(this)} retrieveSentHashes={this.retrieveSentHashes.bind(this)} retrieveReceivedHashes={this.retrieveReceivedHashes.bind(this)} />
        <Modal sendMoney={ this.sendMoney.bind(this) } toggleModal={ this.toggleModal.bind(this) } modalOpen={ this.state.modalOpen } />
        
        <Footer />
      </div>
    );
  }
}

export default withCookies(withRouter(App));