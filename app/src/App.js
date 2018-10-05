import React from 'react';
import { withRouter } from 'react-router';
import { utils, providers } from 'web3';
import { NotificationManager } from 'react-notifications';
import history from '~/common/history';
import 'bootstrap/dist/css/bootstrap.min.css';
import '~/assets/scss/styles.scss';
import Header from '~/Components/Header/Header';
import Subheader from '~/Components/Header/Subheader';
import Content from '~/Components/Content';
import Footer from '~/Components/Footer/Footer';
import Modal from '~/Components/Modal/Modal';
import { login, logout, loggedIn } from '~/common/loginService';
import { retrieveSentHashes, retrieveReceivedHashes, saveNewHash } from '~/common/transactionService';
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
      email : '',
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
    // Use Browser/metamask version
    if(typeof web3 !== 'undefined'){
      this.web3Provider = web3.currentProvider;
      console.log('USING METAMASK', this.web3Provider);
    // Use web3 from node_modules
    // set provider to remote RPC
    }else{
      this.web3Provider = new Web3.providers.HttpProvider('http://35.237.222.172:8111');
      console.log('USING REMOTE RPC');
    }

    //this.web3 = new Web3(this.web3Provider);
    //console.log('web3 provider',this.web3Provider);
    console.log('web3 is connected ',web3.isConnected());
  }

  sendMoney(to, value){

    // Get specific Eth Account
    web3.eth.getCoinbase((err, from) => {
      console.log('ACC',from);
      // Send money to address
      web3.eth.sendTransaction({
        from,
        to,
        value : web3.toWei(value, "ether"), 
      }, (error, hash)=>{
        console.log('sent', from);
        saveNewHash(from, to, hash)
        .then((response) =>{
          console.log('success!', response);
        });
      });


      // web3.eth.sendTransaction({
      //     from,
      //     to,
      //     value: web3.toWei(value, "ether")
      // })
      // .on('transactionHash', function(hash){
      //   console.log('hash');
      // })
      // .on('receipt', function(receipt){
      //   console.log('receipt');
      // })
      // .on('confirmation', function(confirmationNumber, receipt){
      //   console.log('confirmationNumber, receipt');
      // })
      // .on('error', console.error)
      // .then(function(receipt){
      //     console.log('receipt', receipt);
      // });



    });
  }
  readBalance(){
    web3.eth.getBalance("0x895b758229aff6c0f95146a676bbf579ad7636aa", (error, wei)=>{
      if (!error) {
        
        var balance = utils.fromWei(wei.plus(21).toString(10), 'ether');
        console.log('wei', wei.toString(), 'ether',utils.fromWei(wei.toString(), 'ether'));
        this.setState(()=>({balance}));
    }

    });
    web3.eth.getTransaction('0x2de1d12d0785196767d90043635fc5c1e2c6d276e604b2dc5ef217a6fd8d7cdb', (error, data) =>{
      console.log('D',data);
    });
  }

  retrieveSentHashes(){
    console.log('pub eth key',this.state.publicEthKey);
    return retrieveSentHashes(this.state.publicEthKey);

  }

  retrieveReceivedHashes(){
    return retrieveReceivedHashes(this.state.publicEthKey);
  }

  // WEB3 Call to get transaction data of supplied hashes from blockchain
  retrieveTransactionData(transArray){
    const promiseArray = transArray.map((p, i)=>{
      
      if(i <= 5){
        return new Promise((resolve, reject)=>{
          web3.eth.getTransaction(transArray[i].hash, (err, data) =>{
            if(err){
              console.log('ERR', err);
              reject(err);
            }
            resolve(data);
          });
        });
      }
      
    });


    return Promise.all(promiseArray)
    .then((values) =>{
      //console.log('BC data', values);
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
      .then((data) =>{console.log('!!!!!', data);
        this.setState({loggedIn : true, publicEthKey : data.data.publicEthKey, email : data.data.email });
        this.initWeb3();
      })
      
    } 
  }



  render(){
    return(
      <div>
        <Header toggleModal={ this.toggleModal.bind(this) } loggedIn={ this.state.loggedIn } handleLogin={this.handleLogin.bind(this)} />
        <Subheader />
        <Content modalOpen={ this.state.modalOpen } state={this.state} loggedIn={ this.state.loggedIn } retrieveTransactionData={ this.retrieveTransactionData.bind(this) } retrieveSentHashes={ this.retrieveSentHashes.bind(this) } retrieveReceivedHashes={ this.retrieveReceivedHashes.bind(this) } checkLoggedIn={this.loggedIn.bind(this)}  handleLogin={this.handleLogin.bind(this)}  modifyAppState={this.modifyAppState.bind(this)} />
        <Modal sendMoney={ this.sendMoney.bind(this) } toggleModal={ this.toggleModal.bind(this) } modalOpen={ this.state.modalOpen } />
        
        <Footer />
      </div>
    );
  }
}

export default withCookies(withRouter(App));