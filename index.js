require('lodash');

const fs = require('fs');
const HttpService = require('./services/http');
const constant = require('./common/constants');


/**
 *
 * @param {Object} requestData The requestData to get access token.
 * 'user-id' is userID of user and 'api-key' is a key
 * 'user-id' and 'api-key' can get using the following steps:
 * 'user-id' and 'api-key' can get using the following steps:
 * Sign up and login on https:www.weesign.mx and choose a subscription plan
 * Note userID and ApiKey from the profile section (if apiKey not available then you can Generate by clicking on Generate API key button)
 *
 *(Note: this access token is valid up to 5 minutes)
 * @returns {Promise<{responseData, message, success, responseCode}>}
 */
async function accessToken(requestData) {
    if (!requestData || !Object.keys(requestData).length || !requestData['user-id'] || !requestData['api-key']) {
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);
    }

    const headers = {
        'user-id': requestData['user-id'] || '',
        'api-key': requestData['api-key'] || '',
    };

    return await HttpService.httpRequest(constant.HTTP_METHOD.POST, constant.HOST_URL, constant.API_END_POINTS.ACCESS_TOKEN, {}, headers);

}

/**
 *
 * @param {Object} requestData The requestData for add document.
 * 'user-id' is userID of user and 'token' is a token
 * 'token' can get using the accessToken as shown above
 *  'file' can be file Object or ReadStream Object
 *  'documentSignType' Type of signature can be ELECTRONIC_SIGNATURE or E_FIRMA
 * 'country' country  is country name For example Mexico, United States, Canada, New Zealand, Australia, Afghanistan, Aland Islands, Albania
 *  'language' language for sending mail format in spanish or english. For spanish language is 'es' and For english language is 'en'
 *
 *
 * @returns {Promise<{responseData, message, success, responseCode}>}
 */
async function addDocument(requestData) {
    if (!requestData || !Object.keys(requestData).length || !requestData['user-id'] || !requestData.token || !requestData.file || !requestData.file.path || !requestData.documentSignType|| !requestData.country || !requestData.language) {
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);
    }

    const headers = {
        ...getHeaders(requestData),
        documentSignType:requestData.documentSignType || constant.DOCUMENT_SIGN_TYPE.ELECTRONIC,
        country:requestData.country || constant.COUNTRY.MEXICO,
        language:requestData.language || constant.LANGUAGE.SPANISH,
        filename: requestData.file.name || requestData.file.path.replace(/^.*[\\\/]/, ''),
    };

    const formData = {
        document: {
            value:  fs.createReadStream(requestData.file.path),
            options: {},
        },
    };

    const path = constant.API_END_POINTS.DOCUMENTS;
    return await HttpService.httpMultiPartRequest(constant.HTTP_METHOD.POST, constant.HOST_URL, path, formData, headers);


}

/**
 *
 * @param {Object} requestData The requestData for getting document associated with user.
 * 'user-id' is userID of user and 'token' is a token
 * 'token' can get using the accessToken as shown above
 *  'status' status of documents which can be  DRAFT, PENDING, and COMPLETED. Default Value is ALL for getting all type of document
 * 'limit' limit of number document to be fetch and Default value is 0 means there is no limit for document
 * 'skip' skip of number document to be skip and Default value is 0 means there is no skip for document
 *
 *
 * @returns {Promise<{responseData, message, success, responseCode}>}
 */
async function getDocuments(requestData) {
    if (!requestData || !Object.keys(requestData).length || !requestData['user-id'] || !requestData.token) {
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);
    }

    const headers = getHeaders(requestData);
    if (!headers)
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);

    const path = constant.API_END_POINTS.DOCUMENTS + `?status=${requestData.status ? requestData.status : 'ALL'}&${requestData.limit || 0}&${requestData.skip || 0}`;

    return await HttpService.httpRequest(constant.HTTP_METHOD.GET, constant.HOST_URL, path, {}, headers);

}

/**
 *
 * @param {Object} requestData The requestData for getting a particular document.
 * 'user-id' is userID of user and 'token' is a token
 * 'token' can get using the accessToken as shown above
 *  'documentID' documentID of document which to be fetch
 *
 *
 * @returns {Promise<{responseData, message, success, responseCode}>}
 */
async function getDocumentByID(requestData) {
    let headers = getHeaders(requestData);

    let path = constant.API_END_POINTS.DOCUMENTS + `/${requestData.documentID || ''}`;
    return await HttpService.httpRequest(constant.HTTP_METHOD.GET, constant.HOST_URL, path, {}, headers);

}
/**
 *
 * @param {Object} requestData The requestData for validate document for completion.
 * 'user-id' is userID of user and 'token' is a token
 * 'token' can get using the accessToken as shown above
 *  'file' can be file Object or ReadStream Object
 *
 *
 * @returns {Promise<{responseData, message, success, responseCode}>}
 */

async function validateDocument(requestData) {
    if (!requestData || !Object.keys(requestData).length || !requestData['user-id'] || !requestData.token || !requestData.file || !requestData.file.path) {
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);
    }

    const headers = getHeaders(requestData);

    if (!headers) {
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);
    }

    const formData = {
        document: {
            value:  fs.createReadStream(requestData.file.path),
            options: {
                filename: requestData.file.name ?requestData.file.name : requestData.file.path.replace(/^.*[\\\/]/, ''),
            },
        },
    };
    const path = constant.API_END_POINTS.DOCUMENTS_VALIDATE;

    return await HttpService.httpMultiPartRequest(constant.HTTP_METHOD.POST, constant.HOST_URL, path, formData, headers);

}
/**
 *
 * @param {Object} requestData The requestData for update the document.
 * 'user-id' is userID of user and 'token' is a token
 * 'token' can get using the accessToken as shown above
 *  'documentID' documentID of document which to be fetch
 *  'documentSignType' Type of signature can be ELECTRONIC_SIGNATURE or E_FIRMA
 * 'country' country  is country name For example Mexico, United States, Canada, New Zealand, Australia, Afghanistan, Aland Islands, Albania
 *
 * (Note: the document ony can update if document status is DRAFT.)
 * @returns {Promise<{responseData, message, success, responseCode}>}
 */

async function updateDocument(requestData) {

    if (!requestData || !Object.keys(requestData).length || !requestData['user-id'] || !requestData.token || !requestData.documentID || !requestData.documentSignType || !requestData.country) {
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);
    }

    const headers = getHeaders(requestData);
    if (!headers) {
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);
    }

    const data = {
        documentID: requestData.documentID || '',
        documentSignType: requestData.documentSignType || '',
        country: requestData.country || '',
    };

    const path = constant.API_END_POINTS.DOCUMENTS;
    return await HttpService.httpRequest(constant.HTTP_METHOD.PUT, constant.HOST_URL, path, data, headers);

}

/**
 *
 * @param {Object} requestData The requestData for sending the document.
 * 'user-id' is userID of user and 'token' is a token
 * 'token' can get using the accessToken as shown above
 *  'documentID' documentID of document which to be fetch
 *  'postedTo' postedTo is email address who will receive this document
 *
 * (Note: the document ony can share to someone  if document status is COMPLETED.)
 * @returns {Promise<{responseData, message, success, responseCode}>}
 */
async function shareDocument(requestData) {
    if (!requestData || !Object.keys(requestData).length || !requestData['user-id'] || !requestData.token || !requestData.documentID || !requestData.postedTo) {
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);
    }

    const headers = getHeaders(requestData);

    if (!headers) {
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);
    }

    const data = {
        documentID: requestData.documentID || '',
        postedTo: requestData.postedTo || '',
    };

    const path = constant.API_END_POINTS.DOCUMENTS_SHARE;
    return await HttpService.httpRequest(constant.HTTP_METHOD.PUT, constant.HOST_URL, path, data, headers);


}
/**
 *
 * @param {Object} requestData The requestData for delete the document.
 * 'user-id' is userID of user and 'token' is a token
 * 'token' can get using the accessToken as shown above
 *  'documentID' documentID of document which to be delete
 *
 * (Note: The document only can delete if document status is DRAFT. or if status PENDING and none of signatory has not sign the document.)
 * @returns {Promise<{responseData, message, success, responseCode}>}
 */
async function deleteDocument(requestData) {
    if (!requestData || !Object.keys(requestData).length || !requestData['user-id'] || !requestData.token)
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);

    let headers = getHeaders(requestData);
    if (!headers)
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);

    let path = constant.API_END_POINTS.DOCUMENTS + `?documentID=${requestData.documentID ? requestData.documentID : ''}`;
    return await HttpService.httpRequest(constant.HTTP_METHOD.DELETE, constant.HOST_URL, path, {}, headers);

}
/**
 *
 * @param {Object} requestData The requestData for add signatory of the document.
 * 'user-id' is userID of user and 'token' is a token
 * 'token' can get using the accessToken as shown above
 *  'message' message is text that will we send in the mail to the signatories.
 *  'title' title is text that will we send in the mail to the signatories.
 *  'signatory' signatory is a array of object and each object contain email address on emailID key and name of signatory on the name key.
 *
 * (Note: The signatory of document can add if document status is DRAFT.)
 * @returns {Promise<{responseData, message, success, responseCode}>}
 */

async function addSignatory(requestData) {
    if (!requestData || !Object.keys(requestData).length || !requestData['user-id'] || !requestData.token)
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);

    let headers = getHeaders(requestData);
    if (!headers)
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);

    let data = {
        documentID: requestData.documentID ? requestData.documentID : '',
        message: requestData.message ? requestData.message : '',
        title: requestData.title ? requestData.title : '',
        signatory: requestData.signatory && requestData.signatory.length ? requestData.signatory : [],
    };

    let path = constant.API_END_POINTS.DOCUMENTS_SIGNATORY;
    return await HttpService.httpRequest(constant.HTTP_METHOD.PUT, constant.HOST_URL, path, data, headers);

}
/**
 *
 * @param {Object} requestData The requestData for resend mail for signature to the signatory of the document.
 * 'user-id' is userID of user and 'token' is a token
 * 'token' can get using the accessToken as shown above
 *  'documentID' documentID of document.
 *
 * (Note: Resend mail can send only if document status is PENDING. and mail will send whose signature not done.)
 * @returns {Promise<{responseData, message, success, responseCode}>}
 */
async function resendEmailToSignatory(requestData) {
    if (!requestData || !Object.keys(requestData).length || !requestData['user-id'] || !requestData.token || !requestData.documentID)
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);

    let headers = getHeaders(requestData);
    if (!headers)
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);

    let path = constant.API_END_POINTS.DOCUMENTS_RESEND + `?documentID=${requestData.documentID ? requestData.documentID : ''}`;
    return await HttpService.httpRequest(constant.HTTP_METHOD.PUT, constant.HOST_URL, path, {}, headers);

}

/**
 *
 * @param {Object} requestData The requestData for add webHook for triggering action while processing of the document.
 * 'user-id' is userID of user and 'token' is a token
 * 'token' can get using the accessToken as shown above
 *  'url' url of the hook which will be htted on particular action For Example signDocument, completedDocument.
 *  'type' type define the type webHook and type can be either completedDocument, or signDocument
 *
 * @returns {Promise<{responseData, message, success, responseCode}>}
 */

async function addWebHook(requestData) {
    if (!requestData || !Object.keys(requestData).length || !requestData['user-id'] || !requestData.url || !requestData.type)
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);

    let headers = getHeaders(requestData);
    if (!headers)
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);
    let path = constant.API_END_POINTS.WEBHOOK + `?url=${requestData.url ? requestData.url : ''}&type=${requestData.type ? requestData.type : constant.WEBHOOK_TYPE.COMPLETE_DOCUMENT}`;
    return await HttpService.httpRequest(constant.HTTP_METHOD.POST, constant.HOST_URL, path, {}, headers);

}
/**
 *
 * @param {Object} requestData The requestData for get webHook.
 * 'user-id' is userID of user and 'token' is a token
 * 'token' can get using the accessToken as shown above
 *  'webHookID' webHookID is Optional for getting a particular webHook.
 *
 * @returns {Promise<{responseData, message, success, responseCode}>}
 */
async function getWebHook(requestData) {
    if (!requestData || !Object.keys(requestData).length || !requestData['user-id'] || !requestData.token)
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);

    let headers = getHeaders(requestData);
    if (!headers)
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);

    let path = constant.API_END_POINTS.WEBHOOK;
    if(requestData.webHookID)
        path = path + `?webHookID=${requestData.webHookID}`;
    return await HttpService.httpRequest(constant.HTTP_METHOD.GET, constant.HOST_URL, path, {}, headers);

}
/**
 *
 * @param {Object} requestData The requestData for delete webHook.
 * 'user-id' is userID of user and 'token' is a token
 * 'token' can get using the accessToken as shown above
 *  'webHookID' webHookID a particular webHook to be delete.
 *
 * @returns {Promise<{responseData, message, success, responseCode}>}
 */
async function deleteWebHook(requestData) {
    if (!requestData || !Object.keys(requestData).length || !requestData['user-id'] || !requestData.token || !requestData.webHookID)
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);

    let headers = getHeaders(requestData);
    if (!headers)
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);

    let path = constant.API_END_POINTS.WEBHOOK + `?webHookID=${requestData.webHookID}`;
    return await HttpService.httpRequest(constant.HTTP_METHOD.DELETE, constant.HOST_URL, path, {}, headers);

}
/**
 *
 * @param {Object} requestData The requestData for update webHook.
 * 'user-id' is userID of user and 'token' is a token
 * 'token' can get using the accessToken as shown above
 * 'url' url is webHook url to be update
 *  'webHookID' webHookID a particular webHook to be update.
 *
 * @returns {Promise<{responseData, message, success, responseCode}>}
 */
async function updateWebHook(requestData) {
    if (!requestData || !Object.keys(requestData).length || !requestData['user-id'] || !requestData.token || !requestData.url || !requestData.webHookID)
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);

    let headers = getHeaders(requestData);
    if (!headers)
        return HttpService.response({}, constant.MESSAGE.INVALID_PARAMS, constant.RESPONSE.FAILURE, constant.RESPONSE.CODES.NOT_FOUND);


    let path = constant.API_END_POINTS.WEBHOOK + `?url=${requestData.url}&webHookID=${requestData.webHookID}`;

    return await HttpService.httpRequest(constant.HTTP_METHOD.PUT, constant.HOST_URL, path, {}, headers);

}

function getHeaders(requestData) {
    if (!requestData || !Object.keys(requestData).length || !requestData['user-id'] || !requestData.token)
        return false;

    return {
        'user-id': requestData['user-id'] ? requestData['user-id'] : '',
        'token': requestData.token ? requestData.token : ''
    };
}

module.exports = {
    accessToken,
    addDocument,
    getDocuments,
    getDocumentByID,
    validateDocument,
    updateDocument,
    shareDocument,
    deleteDocument,
    addSignatory,
    resendEmailToSignatory,
    addWebHook,
    getWebHook,
    deleteWebHook,
    updateWebHook,
};
