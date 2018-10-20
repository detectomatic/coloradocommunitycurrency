// LIBRARIES
import axios from 'axios';

// Set AJAX axios endpoint to our server-side node app, 
// whether that be on localhost or the google cloud for production
const endpoint = `${API_ENDPOINT}users/`;
console.log('ENDPOINT!', endpoint);
// Login via Node backend
const login = function(formData){
    return axios.post(`${endpoint}login`,{email: formData.email, password: formData.password}, {withCredentials:true})
    .then((data) => {console.log('data', data);
        if(data.status === 200){
            console.log('LI',data);
            const errorObj = data.data.error;
            if(errorObj){
                return {
                    error : errorObj.errors.map((error)=>{
                        return {error : {type : 'Database Error', message : `${error.type} at ${error.path} input`}}
                    })
                }
            }
            return data.data;
        }else{
            return {type : 'Server Error', message : `There was a server error with a status code of ${data.status}`}
        }
    }).catch((error) => {
        console.log('login error', error);
        return { error : [{type : 'AJAX Error', message : `Email or password did not match our records!`}] }
    })
};

// Register new account via Node backend
const register = function(formData){
    return axios.post(`${endpoint}register`,formData)
    .then((data) => {console.log('data!', data);
        if(data.status === 200){
            const errorObj = data.data.error;
            if(errorObj){
                return {
                    error : errorObj.errors.map((error)=>{
                        return {error : {type : 'Database Error', message : `${error.type} at ${error.path} input`}}
                    })
                }
            }console.log('EP', endpoint, data.data);
            return data.data;
        }else{
            return {type : 'Server Error', message : `There was a server error with a status code of ${data.status}`}
        }
    }).catch((error) => {
        return {type : 'AJAX Error', message : `${error}`}
    })
};

// Logout via Node backend
const logout = function(){
    return axios.get(`${endpoint}logout`, {withCredentials:true})
    .then((data) => {console.log('in lo');
        if(data.status === 200){
            //console.log(data,'cookie-', getCookie('brysonsession'));
            const errorObj = data.data.error;
            if(errorObj){
                return {
                    error : errorObj.errors.map((error)=>{
                        return {error : {type : 'Database Error', message : `${error.type} at ${error.path} input`}}
                    })
                }
            }
            return data.data;
        }else{
            return {type : 'Server Error', message : `There was a server error with a status code of ${data.status}`}
        }
    }).catch((error) => {
        return { error : [{type : 'AJAX Error', message : `Couldn't communicate with server to log out!`}] }
    })
};

// Check if user is logged in
const loggedIn = function(){
    return axios.get(`${endpoint}logged-in`, {withCredentials:true})
    .then((data) => {
        console.log('LI data', data);
        return data;
    })
    .catch((error)=>{
        console.log('li error', error);
    });
};

export { login, register, logout, loggedIn }