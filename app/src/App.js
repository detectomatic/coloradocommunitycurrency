// REACT
import React from 'react';
import { withRouter } from 'react-router';
// LIBRARIES
import { utils } from 'web3';
import { NotificationManager } from 'react-notifications';
import history from '~/common/history';
import { withCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';
// COMPONENTS
import Header from '~/Components/Header/Header';
import Subheader from '~/Components/Header/Subheader';
import Content from '~/Components/Content';
import Footer from '~/Components/Footer/Footer';
import Modal from '~/Components/Modal/Modal';
// COMMON
import { login, logout, loggedIn } from '~/common/userService';
import { retrieveSentHashes, retrieveReceivedHashes, saveNewHash } from '~/common/transactionService';
// ASSETS
import '~/assets/scss/styles.scss';

class App extends React.Component{
  constructor(){
    super();
    this.state = {
      // User details
      loggedIn : false,
      publicEthKey : '',
      email : '',
      // Cookies saved on client
      cookie : '',
      // Indicates whether the modal is open or closed
      modalOpen : false
    }
  }

  // Helper method to set state and call a callback function if it exists
  // Used for some child components to update the state without throwing a react memory leak error
  _modifyAppState(state, cb){
    this.setState(()=>(Object.assign(this.state, state)), ()=>{
      if(cb) cb();
    });
  }

  // Initialize Web 3 to communicate with the blockchain
  _initWeb3(){
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

  // Read the balance of an account
  _readBalance(){
    return new Promise((resolve, reject)=>{
      web3.eth.getBalance(this.state.publicEthKey, (error, wei)=>{
        if (!error) {
          const weiBalance = utils.toBN(wei);
          const ethBalance = utils.fromWei(weiBalance, 'ether');
          resolve(ethBalance);
        }else{reject('Error retrieving Balance data');}
      });
    })
  }
  
  // Send DCoin to a specific user
  _sendMoney(to, value){

    // Get specific Eth Account
    web3.eth.getCoinbase((err, from) => {
      // Send money to address
      web3.eth.sendTransaction({
        from,
        to,
        value : web3.toWei(value, "ether"), 
      }, (error, hash)=>{
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

  // Retrieve the SENT transaction hashes for this user
  _retrieveSentHashes(){
    return retrieveSentHashes(this.state.publicEthKey);

  }

  // Retrieve the RECEIVED transaction hashes for this user
  _retrieveReceivedHashes(){
    return retrieveReceivedHashes(this.state.publicEthKey);
  }

  // WEB3 Call to get transaction data of supplied hashes from blockchain
  _retrieveTransactionData(transArray){
    const promiseArray = transArray.map((p, i)=>{
      if(i < 10){
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
      // Was receiving undefined occasionally... need to look into this later
      // In the mean time, just don't show them
      return values.filter((v)=>{
        return typeof v !== 'undefined';
      });
    });
  }

  // Handle login to node backend on google cloud
  _handleLogin(doLogin, email, password){
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

  // Create a notification of a specified type with specified message
  // Used Mainly on login and transaction table
  _createNotification(type, message){
    switch (type) {
      case 'info':
        NotificationManager.info(message, 'Important!', 1200);
        break;
      case 'success':
        NotificationManager.success(message, 'Success!', 1200);
        break;
      case 'error':
        NotificationManager.error(message, 'Error!', 1200);
        break;
    }
  }

  // Toggle the Transaction Modal open & closed
  _toggleModal(){
    this.setState({ modalOpen : !this.state.modalOpen });
  }

  // When Component mounts, check if user is already logged in by 
  // checking for a  client cookie and checking with node backend.
  // If logged in, set state to the user's data
  componentWillMount(){ console.log('CWM');
    //const cookieName = APP_MODE === 'development' ? 'sid' : '1P_JAR';
    // const cookie = this.props.cookies.get('sid');
    // if(cookie !== undefined) {
      loggedIn()
      .then((data) =>{
        console.log('DATA', data);
        if(data){
          this.setState({loggedIn : true, publicEthKey : data.data.publicEthKey, email : data.data.email });
          this._initWeb3();
        }
      })
    //} 
  }

  // Render APP Component
  render(){
    return(
      <div>
        <Header handleLogin={this._handleLogin.bind(this)} loggedIn={ this.state.loggedIn } toggleModal={ this._toggleModal.bind(this) } />
        <Subheader />
        <Content 
          createNotification={this._createNotification.bind(this)} 
          handleLogin={this._handleLogin.bind(this)} 
          modifyAppState={this._modifyAppState.bind(this)} 
          readBalance={ this._readBalance.bind(this) }
          retrieveTransactionData={ this._retrieveTransactionData.bind(this) } 
          retrieveSentHashes={ this._retrieveSentHashes.bind(this) } 
          retrieveReceivedHashes={ this._retrieveReceivedHashes.bind(this) } 
          state={ this.state } 
        />
        <Footer />
        {/* Render modal if user is logged in */}
        { this.state.loggedIn ? <Modal modalOpen={ this.state.modalOpen } sendMoney={ this._sendMoney.bind(this) } toggleModal={ this._toggleModal.bind(this) } /> : null }
      </div>
    );
  }
}

// App Component must be wrapped in withRouter to handle routing within the app,
// and must be wrapped in withCookies for access to client's cookie data
export default withCookies(withRouter(App));