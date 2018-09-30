import React from 'react';
import ReactTooltip from 'react-tooltip';
import { MdContentCopy } from 'react-icons/md';
import * as utils from 'web3-utils';
import { BigNumber } from 'bignumber.js';

export default class TransactionTable extends React.Component{
  constructor(){
    super();
    this.state = {
      sent : [],
      received : []
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
      console.log(trans.value);
      const val = utils.toBN(trans.value);
      console.log('V', val);
      return (
        <tr key={i}>
          <td>
            <strong className="date_container">9/15/18</strong>
            <span className="time_container">{trans.timestamp}</span>
          </td>
          <td>
            <span className={`address_container address-container_${i}`} onClick={this.copyAddress.bind(this, trans.address)}>{trans.from}</span>
            <span className="copy_container" onClick={this.copyAddress.bind(this, trans.address)} data-tip="Copy Address to Clipbord"><MdContentCopy /></span>
          </td>
          <td>
            <strong className="amount_container">$ { utils.fromWei(val, 'ether') }</strong>
          </td>
        </tr>
      );
    });
    return (
      transactionEls
    );
  }

  // componentWillReceiveProps(nextProps){
  //   if(nextProps.){

  //   }
  // }

  componentDidMount(){
    this.props.retrieveSentHashes()
    .then((data) =>{
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
            <button className="btn btn-secondary" onClick={this.props.retrieveSentHashes}>Sent Hashes</button>
          <button className="btn btn-secondary" onClick={this.props.retrieveReceivedHashes}>Received Hashes</button>
        </section>
        <section className="table-section">
          <table className="table table-striped">
            <thead>
              <tr>
                <th><span className="date_label_container">Date</span></th>
                <th><span className="address_label_container">Address</span></th>
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