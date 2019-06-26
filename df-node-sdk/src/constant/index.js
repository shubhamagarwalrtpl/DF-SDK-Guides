export const CONSTANTS = {
    URL: {
        BASE_URL: 'https://qat.datafornix.com/', //'http://192.168.5.106:8000/',
        API_VERSION: '/api/v1',
        CREATE_USER_URL: '/create-user/',
        CREATE_USER_TOKEN_URL: '/create-user-token/',
        GET_OCR_DATA_URL: '/asset/get-ocr-results/',
        SAVE_DOCUMENT_DATA_URL: '/identity/',
        GET_ASSETS_URL: '/asset/detail/',
        GET_SHARED_ASSETS_URL: '/asset/shared/',
        REVOKE_ACCESS_URL: '/asset/revoke/access/',
        UPDATE_ACCESS_TIME_URL: '/asset/share-time/',
        ORGANISATION_ASSET_REQUEST_URL: '/asset/requested-access/',
        ORGANISATION_ASSET_REQUEST_DENY_URL: '/asset/grant-access/',
        ORGANISATION_ALL_ASSET_REQUEST_URL: '/asset/email/organisation/',
        UPLOAD_ASSET_REQUEST_URL: '/asset/request/upload/',
        SELFIE_CHECK_URL: '/selfie-check/',
        VIDEO_LIVELINESS_URL: '/video-liveliness-check/',
        SELFIE_TOKEN: '/selfie-token/',
        SELFIE_RESULT: '/selfie-results/'
    },
    ASSET_TYPE: {
        DRIVING_LICENCE: 'Driving Licence',
        IDENTITY_CARD: 'Identity Card',
        PAN_CARD: 'PAN Card',
        PASSPORT: 'Passport',
        IS_RIGHT_TO_WORK: 'Is Right To Work',
        GAS_BILL: 'Gas Bill'
    },
    VAULT_STATUS: {
        REQUEST_ALLOW: 'GRANTED',
        REQUEST_DENY: 'REJECTED'
    },
    COMPOSITE_STRING_PREFIX: 'datafornix',
    BCRYPT_SALT_KEY_LENGHT: 10,
    MESSAGE: {
        ERROR: {
            SERVER_ERROR: 'something went wrong from server side',
            DATA_DECRYPTION_ERROR: 'Error in data decryption'
        }
    }
};