const extend = require('xtend')
const aschjs = require('asch-js');
const HTTPMethod = require('./httpProvider').HTTPMethod;
 const AschFee = require('./aschFee');
 
const AschUrls = {
    open2:'/api/accounts/open2',
    getAccount:'/api/v2/accounts/',
    queryBalances:'',
    getTransaction:'',
    createTransactionEx:'/peer/transactions'
};


module.exports = AschApi;

function AschApi(provider){
    const self = this;
    self.currentProvider = provider;
}


//
// base queries
//


AschApi.prototype.getAsync = function(path, params, cb){
    const self = this
    self.currentProvider.sendAsync(HTTPMethod.GET,path, params, function(err, response){
      if (!err && response.error) err = new Error('AschApi - HTTP Error - '+JSON.stringify(response))
      if (err) return cb(err)
      cb(null, response)
    })
  }

AschApi.prototype.postAsync = function(path, params, cb){
    const self = this
    self.currentProvider.sendAsync(HTTPMethod.POST,path, params, function(err, response){
      if (!err && response.error) err = new Error('AschApi - HTTP Error - '+JSON.stringify(response))
      if (err) return cb(err)
      cb(null, response)
    })
  }


// util

function generateFnFor(methodName){
  return function(){
    const self = this
    var args = [].slice.call(arguments)
    var cb = args.pop()
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb)
  }
}

function generateFnWithDefaultBlockFor(argCount, methodName){
  return function(){
    const self = this
    var args = [].slice.call(arguments)
    var cb = args.pop()
    // set optional default block param
    if (args.length < argCount) args.push('latest')
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb)
  }
}

function createPayload(data){
  return extend({
    // defaults
    id: createRandomId(),
    jsonrpc: '2.0',
    params: [],
    // user-specified
  }, data)
}


AschApi.prototype.open2 = function(pubKey, cb){
  const self =this;
  var params = {
    publicKey:pubKey
  };
  self.postAsync(AschUrls.open2, params, cb);
}

AschApi.prototype.getAccount = function(address, cb){
  const self =this;
  self.getAsync(AschUrls.getAccount+address, null, cb);
}

AschApi.prototype.broadcastTransactionEx = function(type, args, message, secret, secondSecret='', cb){
  const self =this;
    var trx = {
        type:type,      //转账的合约编号是1  
        fee:0.1*100000000,    //转账的手续费是0.1XAS
        args:args, //合约所需要参数
        message:message,    //做一些备注（非必需）
        secret:secret,   //我的密码（发送这笔交易的人的secret）
        secondSecret:secondSecret};  //二级密码（没设置可以填null，但有些交易必需使用）
    trx = AschFee.convertFee(trx);
    var transaction = aschjs.transaction.createTransactionEx(trx);
    self.postAsync(AschUrls.createTransactionEx, {'transaction':transaction}, cb);
}


AschApi.prototype.transferXAS = function(amount, recipientId, message, secret, secondSecret, cb){
  const self =this;
  self.broadcastTransactionEx(1,[amount,recipientId],message,secret,secondSecret,cb);
}

AschApi.prototype.transferAsset = function(symbol, amount, recipientId, message, secret, secondSecret, cb){
  const self =this;
  self.broadcastTransactionEx(1,[symbol, amount,recipientId],message,secret,secondSecret,cb);
}