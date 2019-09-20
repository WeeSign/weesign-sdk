"use strict";
module.exports = Object.freeze({

    HEADER_KEY_REQUEST_ID_KEY: 'request-id',
    RESPONSE: Object.freeze({
        SUCCESS: true,
        FAILURE: false,
        CODES: Object.freeze({
            SUCCESS: 200,
            EXCEPTION: 500,
            MAINTENANCE: 501,
            NOT_FOUND: 400,
            FORBIDDEN: 401,
            BAD_REQUEST: 402,
            NOT_MODIFIED: 302,
            OPEN_PAY_CARD_ERROR: 3001
        })
    }),
    LOG_TYPE: Object.freeze({
        INFO: 'info',
        ERROR: 'error',
        WARN: 'warn',
        VERBOSE: 'verbose',
        DEBUG: 'debug',
        SILLY: 'silly',
        HTTP_REQUEST: 'http request'
    }),

    MAPPING_TYPE: Object.freeze({
        JSON_TO_JSON: 'JSON_TO_JSON'
    }),
    CURRENT_TIMESTAMP: (new Date()).getTime(),
    HTTP: Object.freeze({
        METHOD_TYPE: Object.freeze({
            POST: 'POST',
            GET: 'GET',
            PUT: 'PUT'
        }),
        HEADER_TYPE: Object.freeze({
            URL_ENCODED: 'content-type": "application/x-www-form-urlencoded',
            APPLICATION_JSON: 'content-type": "application/json',
        }),
        ENDPOINT: {
            ADD_ENTITY: 'add-entity'
        },
        CONTENT_TYPE: {
            MULTI_PART_FORM_DATA: 'multipart/form-data',
            URL_ENCODE: 'application/x-www-form-urlencoded',
            APPLICATION_JSON:  "application/json"
        }
    }),
    HTTP_METHOD:{
        POST:'post',
        GET:'get',
        PUT:'put',
        DELETE:'delete'
    },
    HOST_URL:"https://www.weesign.mx:3000",
    API_END_POINTS:{
        ACCESS_TOKEN:"/access/token",
        DOCUMENTS:"/documents",
        DOCUMENTS_VALIDATE:"/documents/validate",
        DOCUMENTS_SHARE:"/documents/share",
        DOCUMENTS_SIGNATORY:"/documents/signatory",
        DOCUMENTS_RESEND:"/documents/resend-email",
        WEBHOOK:"/webhooks"
    },
    WEBHOOK_TYPE:{
        COMPLETE_DOCUMENT:"completedDocument"
    },
    DOCUMENT_SIGN_TYPE:{
        ELECTRONIC:"ELECTRONIC_SIGNATURE",
        E_FIRMA:"E_FIRMA",
    },
    COUNTRY:{
        MEXICO:"Mexico"
    },
    LANGUAGE:{
        SPANISH:"es",
        ENGLISH:"en"
    },
    MESSAGE:{
        INVALID_PARAMS:"Invalid Parameters"
    }
});