// REACT
import React from 'react';
// LIBRARIES
import PropTypes from 'prop-types';
import { MdFace } from 'react-icons/md';
// ASSETS
import './account.scss';

// COMPONENT
export default class Account extends React.Component{
    
    render(){
        return(
            <div className="page-wrapper account-page">
                <section className="title-section">
                    <div className="subsection">
                        <h1><MdFace /></h1>
                        <p>{this.props.email}</p>
                    </div>
                </section>
                <section className="details-section">
                    <div className="subsection">
                        <h2>Account Details</h2>
                    </div>
                    <div className="subsection subsection-account">
                        <div>
                            <span>Email: </span>
                            <strong>{ this.props.email }</strong>
                        </div>
                        <div>
                            <span>Public Key: </span>
                            <strong>{ this.props.publicEthKey }</strong>
                        </div>
                    </div>
                    {/* <div className="subsection">
                        <h2>Account Actions</h2>
                    </div> */}
          
                </section>
                <section className="bottom-section">
                </section>
            </div>
        );
    }
}

// PROP-TYPES
Account.propTypes = {
    email : PropTypes.string.isRequired,
    publicEthKey : PropTypes.string.isRequired
};