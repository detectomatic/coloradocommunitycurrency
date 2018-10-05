// LIBRARIES
import axios from 'axios';

const endpoint = process.env.NODE_ENV === 'production' ?  'https://SOMEGOOGLEADDRESS' : 'http://localhost:3001/';

// Get transactions from DB based on sender address
const retrieveSentHashes = function(address){console.log('sent ad',address);
    return axios.post(`${endpoint}retrieve-sent-hashes`, { address }, {withCredentials:true})
    .then((data) => {
        console.log('SENT TRANSACTIONS:', data);
        return data;
    })
    .catch((error)=>{
        console.log('AD error', error);
    });
};

// Get transactions from DB based on receiver address
const retrieveReceivedHashes = function(address){
    console.log('address', address);
    return axios.post(`${endpoint}retrieve-received-hashes`, { address }, {withCredentials:true})
    .then((data) => {
        console.log('RECEIVED TRANSACTIONS:', data);
        return data;
    })
    .catch((error)=>{
        console.log('AD error', error);
    });
};

// Save new transaction hash to DB
const saveNewHash = function(from, to, hash){
    return axios.post(`${endpoint}save-new-hash`, { from, to, hash }, { withCredentials:true })
    .then((data) => {
        console.log('Saved this data:', data);
        return data;
    })
    .catch((error)=>{
        console.log('AD error', error);
    });
}

export { retrieveSentHashes, retrieveReceivedHashes, saveNewHash }