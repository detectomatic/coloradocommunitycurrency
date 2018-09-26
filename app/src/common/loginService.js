import axios from 'axios';
const endpoint = process.env.NODE_ENV === 'production' ?  'https://eco-allies.herokuapp.com/' : 'http://localhost:3001/';
//const endpoint = process.env.NODE_ENV === 'production' ?  'https://eco-allies.herokuapp.com/' : 'https://eco-allies.herokuapp.com/';
const login = function(formData){
    return axios.post(`${endpoint}login`,{email: formData.email, password: formData.password}, {withCredentials:true})
    .then((data) => {console.log('data', data);
        if(data.status === 200){
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
        return { error : [{type : 'AJAX Error', message : `Email or password did not match our records!`}] }
    })
};

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

const logout = function(){
    // const getCookie = (name) => {
    //     return document.cookie.split('; ').reduce((r, v) => {
    //       const parts = v.split('=')
    //       return parts[0] === name ? decodeURIComponent(parts[1]) : r
    //     }, '')
    //   }


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

const accountDetails = function(){
    return axios.get(`${endpoint}account-details`, {withCredentials:true})
    .then((data) => {
        //console.log('AD data', data);
        return data;
    })
    .catch((error)=>{
        console.log('AD error', error);
    });
};

export { login, register, logout, loggedIn, accountDetails }