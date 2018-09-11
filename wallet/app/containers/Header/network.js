
const Network = {
  Offline: { rpc: 'offline', tx_explorer: null },
  'Remote Custom RPC': { rpc: 'https://35.227.52.90:8111', tx_explorer: null },
  'Local RPC': { rpc: 'http://127.0.0.1:7545', tx_explorer: null },
  'Ropsten Testnet': { rpc: 'https://ropsten.infura.io/GjiCzFxpQAUkPtDUpKEP', tx_explorer: 'https://ropsten.etherscan.io/tx/' },
  'Main Net': { rpc: 'https://mainnet.infura.io/GjiCzFxpQAUkPtDUpKEP', tx_explorer: 'https://etherscan.io/tx/' },
};

module.exports = Network;
