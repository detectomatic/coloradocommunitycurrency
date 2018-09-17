import React from 'react';
import { MdContentCopy } from 'react-icons/md';

export default class TransactionTable extends React.Component{
  render(){
    return(
      <section>
        <h1>Transaction History</h1>
        <div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Address</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>9/15/18</strong>
                  <span className="time_container">8:22 PM</span>
                </td>
                <td>
                  <span className="address_container">0xe6680987f8893F130aa2313acacb2A5eDaa9CC2B</span>
                  <span className="copy_container"><MdContentCopy /></span>
                </td>
                <td>
                  <strong>$86.24</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>9/15/18</strong>
                  <span className="time_container">8:22 PM</span>
                </td>
                <td>
                  <span className="address_container">0xe6680987f8893F130aa2313acacb2A5eDaa9CC2B</span>
                  <span className="copy_container"><MdContentCopy /></span>
                </td>
                <td>
                  <strong>$86.24</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    );
  }
}