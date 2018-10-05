// REACT
import React from 'react';
import { Link } from 'react-router-dom';
// LIBRARIES
import PropTypes from 'prop-types';
// COMMON
import history from '~/common/history';
// ASSETS
import '~/assets/scss/forms.scss';

// COMPONENT
export default class Login extends React.Component{
    constructor(){
        super();
        // Component state used to handle form functionality
        this.state = {
            email : '',
            password : '',
            errors : []
        };
    }

    // Handle change of form elements and update states
    _handleChange(e){
        const newState = {};
        newState[e.target.name] = e.target.value;
        this.setState(() => (newState));
    }

    // Handle submit of form: send form data to back end, which handles app login logic
    // If login success, navigate to user-collection, otherwise display error message
    _handleSubmit(e){
        e.preventDefault();

        if(this.state.errors.length){
            this.setState(()=>({errors : []}));
        }

        this.props.handleLogin(true, this.state.email, this.state.password)
        .then((data) =>{
            if(data.error){
                const errors = data.error.map((e) =>{
                    return {type:e.type, message:e.message}
                });
                this._handleErrors(errors);
            }else{
                this.props.modifyAppState({
                    loggedIn : true, 
                    publicEthKey : data.publicEthKey,
                    email : data.email
                }, () =>{
                    setTimeout(()=>{
                        history.push(`${APP_ROOT}transactions`);
                    },1000);
                });
            } 
            
        })
        .catch((error) =>{
            if(error){
                this._handleErrors([{type:error.type, message:error.message}])
            }
        });
    }

    // Handle errors from server
    _handleErrors(errors){
        this.setState(()=>({errors : [...this.state.errors, ...errors]}));
    }

    // Render alert status messages
    _renderAlertSection(){
        if(this.state.errors.length){
            const errorEls = this.state.errors.map((error, i) =>(
                    <div className="notification notification-error" key={i}>
                        <strong>ERROR : </strong> <span>{error.message}</span>
                    </div>
                )
            )
            return errorEls;
        }
    }

    // Render success alert message
    _renderSuccessSection(){
        if(this.props.loggedIn){
            return(
                <div className="notification notification-success">
                    <strong>Success! : </strong> <span>You've been logged in.</span>
                </div>
            )
        }
        
    }

    // Render Component
    render(){
        return(
            <div className="page-wrapper form-page login-page">
                <section className="title-section">
                    <div className="subsection">
                        <h1>Access Your Account</h1>
                    </div>
                </section>
                <section className="alert-section">
                    {this._renderAlertSection()}
                    {this._renderSuccessSection()}
                </section>
                <section className="form-section">
                    <form id="loginForm" onSubmit={this._handleSubmit.bind(this)}>
                        <div className="input_container">
                        <label>
                                <strong>Email:</strong>
                                <input name="email" type="email" value={this.state.email} onChange={this._handleChange.bind(this)} placeholder="Enter Email" minLength="4" maxLength="100" required />
                            </label>
                        </div>
                        <div className="input_container">
                            <label>
                                <strong>Password:</strong>
                                <input name="password" type="password" value={this.state.password} onChange={this._handleChange.bind(this)} placeholder="Enter Password" minLength="8" maxLength="100" required />
                            </label>
                        </div>
                        <div className="input_container register_button_container">
                            <button type="submit" className="btn btn-primary btn-block">
                                Sign in
                            </button>
                            <div className="register_account">
                                <strong>OR</strong><br />
                                <Link  to={`${APP_ROOT}register`} >Create a new account</Link>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        );
    }
}

// PROP-TYPES
Login.propTypes = {
    handleLogin : PropTypes.func.isRequired,
    loggedIn : PropTypes.bool.isRequired,
    modifyAppState : PropTypes.func.isRequired
};