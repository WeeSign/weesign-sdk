let  request = require('request');
let Constants = require('../common/constants');
let Utils = require('../utility');
/**
 * execute Http Request
 */
class HttpService {
    static httpRequest(method, hostname, path = '', data = {}, headers = {}, requestID = '0') {
        return new Promise(function (fulfill, reject) {
            let options = {
                url: hostname + path,
                method: method,
                headers: headers,
                family: 4
            };

            if (headers && headers['Content-Type'] === Constants.HTTP.CONTENT_TYPE.URL_ENCODE)
                options.form = data;
            else
                options.json = data;

            request(options, function (error, response, body) {
                let payload = {
                    data: {
                        method: method,
                        hostname: hostname,
                        path: path,
                        data: data,
                        headers: headers
                    }
                };

                if (error) {
                    data.error = error;
                    // Utils.LHTLog('httpRequest', 'end', payload, "sunny", requestID, Constants.LOG_TYPE.ERROR, new Date);
                    reject(error);
                } else {
                    data.response = response;
                    data.body = body;
                    // Utils.LHTLog('httpRequest', 'end', payload, "sunny", requestID, Constants.LOG_TYPE.VERBOSE, new Date);
                    fulfill(body);
                }
            });
        });
    }

}

module.exports = HttpService;
