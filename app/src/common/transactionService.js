// LIBRARIES
import axios from 'axios';

const endpoint = `${API_ENDPOINT}transactions/`;

// Get transactions from DB based on sender address
const retrieveSentHashes = function(address){console.log('sent ad',address);
    return new Promise((resolve, reject) =>{
        return axios.post(`${endpoint}retrieve-sent-hashes`, { address }, {withCredentials:true})
        .then((data) => {
            console.log('SENT TRANSACTIONS:', data);
            resolve(data);
        })
        .catch((error)=>{
            console.log('AD error', error);
            reject(error);
        });
    });
};

// Get transactions from DB based on receiver address
const retrieveReceivedHashes = function(address){
    console.log('address', address);
    return new Promise((resolve, reject) =>{
        return axios.post(`${endpoint}retrieve-received-hashes`, { address }, {withCredentials:true})
        .then((data) => {
            console.log('RECEIVED TRANSACTIONS:', data);
            resolve(data);
        })
        .catch((error)=>{
            console.log('AD error', error);
            reject(error);
        });
    });
};

// Save new transaction hash to DB
const saveNewHash = function(from, to, hash){
    return new Promise((resolve, reject) =>{
        return axios.post(`${endpoint}save-new-hash`, { from, to, hash }, { withCredentials:true })
        .then((data) => {
            console.log('Saved this data:', data);
            resolve(data);
        })
        .catch((error)=>{
            console.log('AD error', error);
            reject(error);
        });
    });
}



export { retrieveSentHashes, retrieveReceivedHashes, saveNewHash }