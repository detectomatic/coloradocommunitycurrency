import React from 'react';
import ReactTooltip from 'react-tooltip'
import { MdContentCopy } from 'react-icons/md';

export default class TransactionTable extends React.Component{

  copyAddress(address){
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute('value', address);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

  }

  renderTransactionRows(){
    console.log(this.props.dummyTransactions);
    const transactionEls = this.props.dummyTransactions.map((trans, i)=>{
      return (
        <tr key={i}>
          <td>
            <strong className="date_container">9/15/18</strong>
            <span className="time_container">{trans.timestamp}</span>
          </td>
          <td>
            <span className={`address_container address-container_${i}`} onClick={this.copyAddress.bind(this, trans.address)}>{trans.address}</span>
            <span className="copy_container" onClick={this.copyAddress.bind(this, trans.address)} data-tip="Copy Address to Clipbord"><MdContentCopy /></span>
          </td>
          <td>
            <strong className="amount_container">$ {trans.amount}</strong>
          </td>
        </tr>
      );
    });
    return (
      transactionEls
    );
  }

  render(){
    return(
      <section>
        <h1>Transaction History</h1>
        <div>
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
        </div>
        <ReactTooltip />
      </section>
    );
  }
}