import React from 'react';
import ReactTooltip from 'react-tooltip';
import { MdContentCopy } from 'react-icons/md';
import * as utils from 'web3-utils';
import { formatDate, formatTime } from '~/common/formatting.js';
import './TransactionTable.scss';
export default class TransactionTable extends React.Component{

  constructor(){
    super();
    this.state = {
      sent : [],
      received : [],
      sentHashes : [],
      receivedHashes : [],
      activeButton : '',
    }
  }
  copyAddress(address){
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute('value', address);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    this.setState(()=>({addressCopied : true}));
    this.props.createNotification('success', 'Address Copied');
  }

  renderTransactionRows(){
      
      let transactionEls;
      // SENT
      if(this.state.activeButton === 'sent'){
        transactionEls = this.state.sent.map((trans, i)=>{
          const val = utils.toBN(trans.value);
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
                  <span className={`address_container address-container_${i}`} onClick={this.copyAddress.bind(this, trans.to)}>
                    <strong>{trans.to}</strong>
                  </span>
                </div>
                <div>
                {
                  <span className={`transaction_container transaction-container_${i} secondary_row`} onClick={this.copyAddress.bind(this, this.state.sentHashes[i])}>
                    {this.state.sentHashes[i].hash}
                  </span>
                }
                </div>
              </td>
              <td  className="copy_cell">
                <div  data-tip="Copy Address to Clipbord">
                  <span className="copy_container" onClick={this.copyAddress.bind(this, trans.to)}><MdContentCopy /></span>
                </div>
                <div data-tip="Copy Transaction to Clipbord">
                  <span className="copy_container" onClick={this.copyAddress.bind(this, this.state.sentHashes[i].hash)}><MdContentCopy /></span>
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
        });
      // RECEIVED
      }else{
        transactionEls = this.state.received.map((trans, i)=>{
          const val = utils.toBN(trans.value);
          return (
            <tr key={`received-${i}`}>
              <td className="date_cell">
                <div className="date_container">
                  <strong>...</strong>
                </div>
                <div className="time_container secondary_row">
                  <span>{formatTime( this.state.sentHashes[i].timestamp )}</span>
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
                  <span className={`address_container address-container_${i}`} onClick={this.copyAddress.bind(this, trans.from)}>
                    <strong>{trans.from}</strong>
                  </span>
                </div>
                <div>
                  {
                    <span className={`transaction_container transaction-container_${i} secondary_row`} onClick={this.copyAddress.bind(this, this.state.receivedHashes[i].hash)}>
                      {this.state.receivedHashes[i].hash}
                    </span>
                  }
                </div>
              </td>
              <td  className="copy_cell">
                <div  data-tip="Copy Address to Clipbord">
                  <span className="copy_container" onClick={this.copyAddress.bind(this, trans.from)}><MdContentCopy /></span>
                </div>
                <div data-tip="Copy Transaction to Clipbord">
                  <span className="copy_container" onClick={this.copyAddress.bind(this, this.state.receivedHashes[i].hash)}><MdContentCopy /></span>
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
        });
      }
      return transactionEls;
  }

  retrieveTableData(button){
    const activeButton = this.state.activeButton;
    if(button === 'sent' && activeButton !== 'sent'){
      this.setState({activeButton : 'sent'});
      this.props.retrieveSentHashes()
      .then((data) =>{
        console.log('@@', data);
        this.props.retrieveTransactionData(data.data)
        .then((transaction)=>{
          console.log('ASDDSA', data.data);
          this.setState(()=>({sent : transaction, sentHashes : data.data}));
        })
      });
    }else if(button === 'received' && activeButton !== 'received'){
      this.setState({activeButton : 'received'});
      this.props.retrieveReceivedHashes()
      .then((data) =>{
        this.props.retrieveTransactionData(data.data)
        .then((transaction)=>{
          this.setState(()=>({received : transaction, receivedHashes : data.data}));
        })
      });
    }
    return;
  }


  componentWillMount() {
    this.retrieveTableData('sent');
  }

  componentDidUpdate(){
    ReactTooltip.rebuild();
  }

  render(){
    return(
      <div className="page-wrapper transaction-page">
        <section className="title-section">
            <div className="subsection">
                <h1>Latest Transactions</h1>
            </div>
        </section>
        <section className="controls-section">
          <div className="btn-group">
            <button className={this.state.activeButton === 'sent' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={()=>{this.retrieveTableData('sent')}}>Sent</button>
            <button className={this.state.activeButton === 'received' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={()=>{this.retrieveTableData('received')}}>Received</button>
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
              {this.renderTransactionRows()}
            </tbody>
          </table>
        </section>
        <ReactTooltip />
      </div>
    );
  }
}