/**
 * Created by rahul on 9/4/18.
 */


class Utils {
    static err(data, message, code = 500) {
        var errorReponseObj = {
            data: data,
            message: message,
            code: code
        };
        return errorReponseObj;
    }


    static response(res, data, message, success, code = 200) {
        var responseObj = {
            responseData: data,
            message: message,
            success: success,
            responseCode: code
        };
        res.format({
            json: () => {
                res.send(responseObj);
            }
        });
    }

    /**
     *
     * @param functionName
     * @param message
     * @param payload:should be in object form
     * @param developerAlias
     * @param requestID
     * @param type
     * @param timestamp
     * @constructor
     */
    static LHTLog(functionName, message, payload = {}, developerAlias = 'developer', requestID = '', type = 'info') {
        console.log(`Message : ${message}, payload : ${JSON.stringify(payload)}, Time: ${new Date()} LogType: ${type}`);
    }

}

module.exports = Utils;