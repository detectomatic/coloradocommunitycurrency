import React from 'react';
import { FaClipboard } from 'react-icons/fa';

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
                  <span>9/15/18</span>
                  <span>8:22 PM</span>
                </td>
                <td>
                  <span>0xe6680987f8893F130aa2313acacb2A5eDaa9CC2B</span>
                  <span><FaClipboard /></span>
                </td>
                <td>
                  <span>$86.24</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>9/15/18</span>
                  <span>8:22 PM</span>
                </td>
                <td>
                  <span>0xe6680987f8893F130aa2313acacb2A5eDaa9CC2B</span>
                  <span><FaClipboard /></span>
                </td>
                <td>
                  <span>$86.24</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    );
  }
}