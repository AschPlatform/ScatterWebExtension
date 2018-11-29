'use strict';

var HttpProvider = require('./httpProvider').HttpProvider;
// var HTTPMethod = require('./httpProvider').HTTPMethod;
var BlockchainNet = require('./httpProvider').BlockchainNet;
var aschjs = require('asch-js');
var AschApi = require('./aschApi');

//var host='http://mainnet.asch.cn';
var host='http://testnet.asch.io';
 const provider = new HttpProvider(host,BlockchainNet.TEST);
// const api='/api/v2/accounts/AGNtPF4jibX3RZ9hTSudCoMcSUrLFCfNf6';
// provider.sendAsync( HTTPMethod.GET,api, {},(err,result) => {
    // console.log('err:'+err);
    // console.log('result:'+JSON.stringify(result));
// });
const secret = 'define wise club transfer top crystal enrich rely nice scout talent romance';
const secondSecret=null;
const addres = aschjs.crypto.getAddress(secret);
const pubKey = aschjs.crypto.getKeys(secret).publicKey;
const aschApi = new AschApi(provider);

// console.log('pubkey:'+pubKey);
// aschApi.open2(pubKey,(err, result) => {
//     console.log('err:'+err);
//     console.log('result:'+JSON.stringify(result));
// });

// aschApi.getAccount(addres,(err, result) => {
//     console.log('err:'+err);
//     console.log('result:'+JSON.stringify(result));
// });

var amount=0.1 * 100000000+'';

const recipient ='AdbL9HkeL5CPHmuVn8jMJSHtdeTHL6QXb';
const message = 'test';
console.log('amount type:'+typeof amount +' '+amount);
// aschApi.broadcastTransactionEx(1,[amount, recipient], message ,secret,secondSecret,(err, result) => {
//     console.log('err:'+err);
//     console.log('result:'+JSON.stringify(result));
// });

aschApi.transferXAS(amount,recipient,message,secret,secondSecret, (err, result) => {
    console.log('err:'+err);
    console.log('result:'+JSON.stringify(result));
});