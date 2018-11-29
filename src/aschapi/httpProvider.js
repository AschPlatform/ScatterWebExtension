'use strict';

const BlockchainNet = {
 MAIN:'mainnet',
 TEST:'testnet',
 LOCAL:'localnet'
};
const Magic ={
  MAIN_MAGIC:'5f5b3cf5',
  TEST_MAGIC:'594fe0f3',
};
const HTTPMethod = {
  GET:'GET',
  POST:'POST',
  PUT:'PUT',
  DELETE:'DELETE'
};

// workaround to use httpprovider in different envs
var XHR2 = require('xhr2');
var querystring = require('querystring');
/*
""
responseText
:
""
responseType
:
""
responseURL
:
"https://ropsten.infura.io/"
responseXML
:
null
status
:
405
statusText
:
"Method Not Allowed"
timeout
:
0
*/

/**
 * InvalidResponseError helper for invalid errors.
 */
function invalidResponseError(request, host) {
  var responseError = new Error('[ethjs-provider-http] Invalid JSON RPC response from provider\n    host: ' + host + '\n    response: ' + String(request.responseText) + ' ' + JSON.stringify(request.responseText, null, 2) + '\n    responseURL: ' + request.responseURL + '\n    status: ' + request.status + '\n    statusText: ' + request.statusText + '\n  ');
  responseError.value = request;
  return responseError;
}

/**
 * HttpProvider should be used to send rpc calls over http
 */
function HttpProvider(host, network=BlockchainNet.MAIN, timeout) {
  if (!(this instanceof HttpProvider)) {
    throw new Error('[ethjs-provider-http] the HttpProvider instance requires the "new" flag in order to function normally (e.g. `const eth = new Eth(new HttpProvider());`).');
  }
  if (typeof host !== 'string') {
    throw new Error('[ethjs-provider-http] the HttpProvider instance requires that the host be specified (e.g. `new HttpProvider("http://localhost:8545")` or via service like infura `new HttpProvider("http://ropsten.infura.io")`)');
  }

  var self = this;
  self.host = host;
  self.nework=network;
  self.timeout = timeout || 0;
}

/**
 * Should be used to make async request
 *
 * @method sendAsync
 * @param {String} method
 * @param {String} path
 * @param {Object} params
 * @param {Function} callback triggered on end with (err, result)
 */
HttpProvider.prototype.sendAsync = function (method, path, params, callback) {
  // eslint-disable-line
  var self = this;
  var request = new XHR2(); // eslint-disable-line
  var url = self.host + path;
  request.timeout = self.timeout;
  if (method == HTTPMethod.GET) {
     url += '?'+querystring.stringify(params);
     params=null;
  }
  //  else {
    
  // }
  console.log('method: '+method);
  request.open(method, url, true);
  request.setRequestHeader('Content-Type', 'application/json');
  if (self.network == BlockchainNet.MAIN) {
    request.setRequestHeader('magic',Magic.MAIN_MAGIC);
  }else{
    request.setRequestHeader('magic',Magic.TEST_MAGIC);
  }
  

  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.timeout !== 1) {
      var result = request.responseText; // eslint-disable-line
      var error = null; // eslint-disable-line

      try {
        result = JSON.parse(result);
      } catch (jsonError) {
        error = invalidResponseError(request, url);
      }

      callback(error, result);
    }
  };

  request.ontimeout = function () {
    callback('[aschjs-provider-http] CONNECTION TIMEOUT: http request timeout after ' + self.timeout + ' ms. (i.e. your connect has timed out for whatever reason, check your provider).', null);
  };

  try {
    request.send(JSON.stringify(params));
  } catch (error) {
    callback('[aschjs-provider-http] CONNECTION ERROR: Couldn\'t connect to node \'' + self.host + '\': ' + JSON.stringify(error, null, 2), null);
  }
};

module.exports = {HttpProvider, HTTPMethod, BlockchainNet} ;