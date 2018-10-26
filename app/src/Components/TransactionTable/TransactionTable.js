// REACT
import React from 'react';
// LIBRARIES
import PropTypes from 'prop-types';
import { utils } from 'web3';
import ReactTooltip from 'react-tooltip';
import { MdContentCopy } from 'react-icons/md';
// COMMON
import { formatDate, formatTime } from '~/common/formatting.js';
// ASSETS
import './TransactionTable.scss';

// COMPONENT
export default class TransactionTable extends React.Component{
  constructor(){
    super();
    this.state = {
      balance : null,
      // All sent / received transactions as js objects for this user,
      // Gathered from the remote ethereum node
      sent : [],
      received : [],
      // All sent / received hashes with timestamp data as js objects 
      // for this user, Gathered from  our PSQL DB
      sentHashes : [],
      receivedHashes : [],
      // Determines whether the user is viewing 'Sent' or 'Received' Transaction data
      sentActive : true,
    }
  }

  // Copies an address to the clipboard of the user by clicking on it or the icon
  _copyAddress(address){
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute('value', address);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    this.setState(()=>({addressCopied : true}));
    this.props.createNotification('success', 'Address Copied');
  }

  _redirectToExplorer(hash, type){
    if(type === 'transaction'){
      window.open(`http://35.227.52.90:8000/#/transaction/${hash.hash}`, '_blank');
    }else{
      window.open(`http://35.227.52.90:8000/#/address/${hash}`, '_blank');
    }
  }

  // Construct the balance info box
  _renderBalance(){
    if(this.state.balance){console.log(parseFloat(this.state.balance).toLocaleString('en'));
      return(
        <section className="balance_section">
          <span className="balance_label">Account Balance:</span>
          <strong className="balance_value">
            { parseFloat(this.state.balance).toLocaleString('en', { style: 'currency', currency: 'USD' })   }
          </strong>
        </section>
      )
    }
    return;
  }

  // Constructs the transaction rows based on sent / received data and returns them to be rendered
  _renderTransactionRows(){
      let transactionEls;
      console.log('asd',this.state.sent);
      // SENT
      if(this.state.sentActive){
        transactionEls = this.state.sent.map((trans, i)=>{
          
          if(trans){
            const val = utils.toBN(trans.value);
            console.log('TRA', trans);
            return (
              <tr key={`sent-${i}`}>
                <td className="date_cell">
                  <div className="date_container">
                    <strong>{formatDate( this.state.sentHashes[i].timestamp )}</strong>
                  </div>
                  <div className="time_container secondary_row">
                    <span>{formatTime( this.state.sentHashes[i].timestamp )}</span>
                  </div>
                </td>
                <td className="label_cell">
                  <div className="sent_to_label_container">
                    <strong>SENT TO:</strong>
                  </div> 
                  <div className="transaction_label_container secondary_row">
                    <span>Transaction: </span>
                  </div> 
                </td>
                <td className="address_cell">
                  <div>
                    <span data-tip="View Account in the Block Explorer"  className={`address_container address-container_${i}`} onClick={this._redirectToExplorer.bind(this, trans.to, 'address')}>
                      <strong>{trans.to}</strong>
                    </span>
                  </div>
                  <div>
                  {
                    <span data-tip="View Transaction in the Block Explorer"  className={`transaction_container transaction-container_${i} secondary_row`} onClick={this._redirectToExplorer.bind(this, this.state.sentHashes[i], 'transaction')}>
                      {this.state.sentHashes[i].hash}
                    </span>
                  }
                  </div>
                </td>
                <td  className="copy_cell">
                  <div  data-tip="Copy Address to Clipbord">
                    <span className="copy_container" onClick={this._copyAddress.bind(this, trans.to)}><MdContentCopy /></span>
                  </div>
                  <div data-tip="Copy Transaction to Clipbord">
                    <span className="copy_container" onClick={this._copyAddress.bind(this, this.state.sentHashes[i].hash)}><MdContentCopy /></span>
                  </div>
                </td>
                <td  className="amount_cell">
                  <div>
                    <strong className="amount_container">
                      
                      $ { utils.fromWei(val, 'ether') }
                    </strong>
                  </div>
                </td>
              </tr>
            )
          }
          
        });

      // RECEIVED
      }else{
        transactionEls = this.state.received.map((trans, i)=>{
          
          if(trans){
            const val = utils.toBN(trans.value);
            return (
              <tr key={`received-${i}`}>
                <td className="date_cell">
                  <div className="date_container">
                    <strong>{formatDate( this.state.receivedHashes[i].timestamp )}</strong>
                  </div>
                  <div className="time_container secondary_row">
                    <span>{formatTime( this.state.receivedHashes[i].timestamp )}</span>
                  </div>
                </td>
                <td className="label_cell">
                  <div className="sent_to_label_container">
                    <strong>SENDER:</strong>
                  </div> 
                  <div className="transaction_label_container secondary_row">
                    <span>Transaction: </span>
                  </div> 
                </td>
                <td className="address_cell">
                  <div>
                    <span data-tip="View Account in Block Explorer" className={`address_container address-container_${i}`}  onClick={this._redirectToExplorer.bind(this, trans.from, 'address')}>
                      <strong>{trans.from}</strong>
                    </span>
                  </div>
                  <div>
                    {
                      <span data-tip="View Transaction in the Block Explorer" className={`transaction_container transaction-container_${i} secondary_row`} onClick={this._redirectToExplorer.bind(this, this.state.receivedHashes[i].hash, 'transaction')}>
                        {this.state.receivedHashes[i].hash}
                      </span>
                    }
                  </div>
                </td>
                <td  className="copy_cell">
                  <div data-tip="Copy Address to Clipbord">
                    <span className="copy_container" onClick={this._copyAddress.bind(this, trans.from)}><MdContentCopy /></span>
                  </div>
                  <div data-tip="Copy Transaction to Clipbord">
                    <span className="copy_container" onClick={this._copyAddress.bind(this, this.state.receivedHashes[i].hash)}><MdContentCopy /></span>
                  </div>
                </td>
                <td  className="amount_cell">
                  <div>
                    <strong className="amount_container">
                      
                      $ { utils.fromWei(val, 'ether') }
                    </strong>
                  </div>
                </td>
              </tr>
            )
          }
        });
      }

      return transactionEls;
  }

  // First, fetches the transaction hashes of the user from the DB,
  // Then fetches the transaction data off the blockchain based on the hashes.
  // Finally, sets the state with all the aquired data
  _retrieveTableData(button){
    // If SENT button is selected and there are no transactions yet fetched
    if(button === 'sent'){
      this.setState({sentActive : true});
      // Only do AJAX calls for data if we don't already have it
      if(!this.state.sent.length){
        this.props.retrieveSentHashes()
        .then((data) =>{
          this.props.retrieveTransactionData(data.data)
          .then((transaction)=>{
            this.setState(()=>({sent : transaction, sentHashes : data.data}));
          })
        });
      }
    // If RECEIVED button is selected and there are no transactions yet fetched
    }else if(button === 'received'){
      this.setState({sentActive : false});
      // Only do AJAX calls for data if we don't already have it
      if(!this.state.received.length){
        this.props.retrieveReceivedHashes()
        .then((data) =>{
          this.props.retrieveTransactionData(data.data)
          .then((transaction)=>{
            this.setState(()=>({received : transaction, receivedHashes : data.data}));
          })
        });
      }
    }

    return;
  }

  // When Component mounts, kick off the sequence of retrieving user transaction data
  componentDidMount() {
    this._retrieveTableData('sent');
    this.props.readBalance()
    .then((balance)=>{
      console.log('balance', balance);
      this.setState({balance});
    })
    .catch((err)=>{
      console.log('ERROR IN BAL', err);
    })
  }

  // When the Component updates, we need to reload the tooltip plugin since it doesn't
  // work with dynamically created elements like the transaction rows
  componentDidUpdate(){
    ReactTooltip.rebuild();
  }

  // Render Component
  render(){
    return(
      <div className="page-wrapper transaction-page">
        { this._renderBalance() }
        <section className="title-section">
            <div className="subsection">
                <h1>Latest Transactions</h1>
            </div>
        </section>
        <section className="controls-section">
          <div className="btn-group">
            {/* Toggle active button based on the state of the app */}
            <button className={ this.state.sentActive ? 'btn btn-primary' : 'btn btn-secondary'} onClick={()=>{this._retrieveTableData('sent')}}>Sent</button>
            <button className={ !this.state.sentActive ? 'btn btn-primary' : 'btn btn-secondary'} onClick={()=>{this._retrieveTableData('received')}}>Received</button>
          </div>
        </section>
        <section className="table-section">
          <table className="table table-striped">
            <thead>
              <tr>
                <th><span className="date_label_container">Date</span></th>
                <th colSpan="3"><span className="address_label_container">Transaction</span></th>
                <th><span className="amount_label_container">Amount</span></th>
              </tr>
            </thead>
            <tbody>
              {/* Dynamically render all transaction rows for user */}
              {this._renderTransactionRows()}
            </tbody>
          </table>
        </section>
        {/* Tooltip Plugin */}
        <ReactTooltip />
      </div>
    );
  }
}

//PROP-TYPES
TransactionTable.propTypes = {
  createNotification : PropTypes.func.isRequired,
  readBalance : PropTypes.func.isRequired,
  retrieveReceivedHashes : PropTypes.func.isRequired,
  retrieveSentHashes : PropTypes.func.isRequired,
  retrieveTransactionData : PropTypes.func.isRequired
}