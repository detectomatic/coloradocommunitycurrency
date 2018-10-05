// REACT
import React from 'react';
// LIBRARIES
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { MdDone, MdClear } from 'react-icons/md';
// ASSETS
import './Modal.scss';

// COMPONENT
export default class TransactionModal extends React.Component{
  constructor(){
    super();
    // The state for the component is used to handle form functionality
    this.state = {
        address : "",
        amount : ""
    }
  }

  // Submit Handler for form modal
  _submitHandler(e){
    e.preventDefault();
    if(!this.state.address || !this.state.amount){
      return;
    }
    this.props.sendMoney(this.state.address, this.state.amount);
  }

  // Handle change of address value
  _handleChange(e){
    if(e.target.id === 'amount'){
      this.setState({amount : e.target.value});
    }else if(e.target.id === 'address'){
      this.setState({address : e.target.value});
    }

  }

  // Generate react element for the indicator next to the address input
  _renderIndicator(){
    if(this.state.address.length === 0){
      return;
    }else if(this.state.address.length === 42){
      return <span className="complete" data-tip="Address is correct length"><MdDone /></span>;
    }
    return <span className="incomplete" data-tip="Address must be 42 Characters Long"><MdClear /></span>;
  }

  // When component updates, we need to reload the tooltip plugin, otherwise it doesn't work in the modal
  componentDidUpdate(){
    ReactTooltip.rebuild();
  }

  // Render Component
  render(){
    return (
      <div className={ this.props.modalOpen ? 'show' : 'hide' }>
        <div className="modal-backdrop" onClick={ this.props.toggleModal }></div>
        <div className="modal" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <form onSubmit={this._submitHandler.bind(this)}>
                <div className="modal-header">
                  <h5 className="modal-title">Send DCoin</h5>
                  <button type="button" className="close" onClick={ this.props.toggleModal }>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="input_container amount_input_container">
                    <label htmlFor="amount"><strong>Amount (in DCoin):</strong></label><br />
                    <input id="amount" value={this.state.amount} onChange={this._handleChange.bind(this)} type="number" placeholder="Enter Amount" />
                  </div>
                  <div className="input_container address_input_container">
                      <label htmlFor="address"><strong>DCoin Address:</strong></label><br />
                      <input id="address" value={this.state.address} onChange={this._handleChange.bind(this)} type="text" placeholder="Enter Address" maxLength="42" />
                      <span className="icon-span">
                        { this._renderIndicator() }
                      </span>
                  </div>
                </div>
                <div className="modal-footer">
                <div className="btn-group">
                  <button type="button" className="btn btn-secondary" onClick={ this.props.toggleModal }>Close</button>
                  <button type="submit" className="btn btn-primary">Send</button>
                </div>
              </div>
              </form>
            </div>
          </div>
        </div>
        {/* Tooltip Plugin */}
        <ReactTooltip />
      </div>
    );
  }
}

// PROP-TYPES
TransactionModal.propTypes = {
  modalOpen : PropTypes.bool.isRequired,
  toggleModal : PropTypes.func.isRequired,
  sendMoney : PropTypes.func.isRequired
};