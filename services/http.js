let request = require('request');
let Constants = require('../common/constants');

/**
 * execute Http Request
 */
class HttpService {
    static httpMultiPartRequest(method, hostname, path = '', data = {}, headers = {}) {
        return new Promise(function (fulfill, reject) {
            request.post({
                url: hostname + path,
                formData: data,
                headers,
            }, function optionalCallback(error, response, body) {
                if (error) {
                    data.error = error;
                    reject(error);
                } else {
                    try{
                        fulfill(JSON.parse(body));
                    } catch (e) {
                        fulfill(body);
                    }
                }
            });
        });
    }

    static httpRequest(method, hostname, path = '', data = {}, headers = {}) {
        return new Promise(function (fulfill, reject) {
            let options = {
                url: hostname + path,
                method: method,
                headers: headers,
                family: 4,
            };

            if (headers && headers['Content-Type'] === Constants.HTTP.CONTENT_TYPE.MULTI_PART_FORM_DATA) {
                options.formData = data;
            } else {
                options.json = data;
            }

            request(options, function (error, response, body) {
                if (error) {
                    data.error = error;
                    reject(error);
                } else {
                    fulfill(body);
                }
            });
        });
    }

    static response(data, message, success, code = 200) {
        return {
            responseData: data,
            message: message,
            success: success,
            responseCode: code,
        };

    }

}

module.exports = HttpService;
