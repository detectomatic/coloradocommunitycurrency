import React from 'react';
import ReactTooltip from 'react-tooltip';
import { MdContentCopy } from 'react-icons/md';
import * as utils from 'web3-utils';
import './TransactionTable.scss';
export default class TransactionTable extends React.Component{

  constructor(){
    super();
    this.state = {
      sent : [],
      received : [],
      transactionHashes : [],
      activeButton : 'sent',
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
    const transactionEls = this.state.sent.map((trans, i)=>{
      const val = utils.toBN(trans.value);
      return (
        <tr key={i}>
          <td className="date_cell">
            <div className="date_container">
              <strong>9/15/18</strong>
            </div>
            <div className="time_container secondary_row">
              <span>10:00 PM</span>
            </div>
          </td>
          <td className="label_cell">
            <div className="sent_to_label_container">
              <strong>SENT TO</strong>
            </div> 
            <div className="transaction_label_container secondary_row">
              <span>Trans#</span>
            </div> 
          </td>
          <td className="address_cell">
            <div>
              <span className={`address_container address-container_${i}`} onClick={this.copyAddress.bind(this, trans.from)}>
                <strong>{trans.from}</strong>
              </span>
            </div>
            <div>
            <span className={`transaction_container transaction-container_${i} secondary_row`} onClick={this.copyAddress.bind(this, this.state.transactionHashes[i])}>
              {this.state.transactionHashes[i]}
            </span>
            </div>
          </td>
          <td  className="copy_cell">
            <div  data-tip="Copy Address to Clipbord">
              <span className="copy_container" onClick={this.copyAddress.bind(this, trans.from)}><MdContentCopy /></span>
            </div>
            <div data-tip="Copy Transaction to Clipbord">
              <span className="copy_container" onClick={this.copyAddress.bind(this, this.state.transactionHashes[i])}><MdContentCopy /></span>
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
      );
    });
    return (
      transactionEls
    );
  }

  toggleSentReceived(button){
    const activeButton = this.state.activeButton;
    if(button === 'sent' && activeButton !== 'sent'){
      this.setState({activeButton : 'sent'});
      this.props.retrieveSentHashes();
    }else if(button === 'received' && activeButton !== 'received'){
      this.setState({activeButton : 'received'});
      this.props.retrieveReceivedHashes();
    }
    return;
  }

  componentDidUpdate(){
    ReactTooltip.rebuild();
  }

  componentDidMount(){
    this.props.retrieveSentHashes()
    .then((data) =>{
      console.log('DD', data);
      this.setState({transactionHashes : data.data});
      this.props.retrieveTransactionData(data.data)
      .then((data)=>{
        console.log('DATA2', data);
        this.setState(()=>({sent : data}));
      })
    });
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
            <button className={this.state.activeButton === 'sent' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={()=>{this.toggleSentReceived('sent')}}>Sent</button>
            <button className={this.state.activeButton === 'received' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={()=>{this.toggleSentReceived('received')}}>Received</button>
          </div>
        </section>
        <section className="table-section">
          <table className="table table-striped">
            <thead>
              <tr>
                <th><span className="date_label_container">Date</span></th>
                <th colspan="3"><span className="address_label_container">Transaction</span></th>
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