export const CONSTANT = {
    API_URL: {
        LOGIN: 'http://52.232.30.222:5000/login/',
        GET_OCR: '/document-capture',
        CREATE_USER_TOKEN: '/create-user-token'
    },
    ENVIRONVEMENT_BASE_URL: {
        'qat': 'http://api.datafornix.com:8081/api',
        'prod': 'https://api-mashreq.datafornix.com',
        'apix': 'https://api.apixplatform.com/DF/1.0/'
    },
    STATUS: {
        SUCCESS: 200
    },
    DOCUMENT_TYPE: {
        DRIVING_LICENCE: 'Driving Licence',
        IDENTITY_CARD: 'Identity Card',
        PAN_CARD: 'PAN Card',
        PASSPORT: 'Passport',
        IS_RIGHT_TO_WORK: 'Is Right To Work',
        GASS_BILL: 'Gas Bill',
        ADDRESS_PROOF: 'Address Proof',
        VEHICLE_REGISTRATION: 'Vehicle Registration',
        SF50: 'SF50 Form',
        WageAllotment: 'Wage Allotment',
        W2Form: 'W2 Form',
        PaySlip: 'Pay Slip'
    },
    VAULT_TYPE: {
        ASSET_LIST: 'asset',
        ASSET_EDIT:  'asset-edit',
        ASSET_DELETE: 'asset-delete',
        ASSET_ERROR: 'asset-error',
        SHARED_BY_ME: 'shared',
        ASSET_REVOKE: 'revoke',
        ASSET_UPDATE_TIME: 'shared-time-update',
        REQUEST_FOR_ASSET: 'request',
        REQUEST_FOR_ASSET_DENY: 'request-deny',
        REQUEST_FOR_ASSET_ALLOW: 'request-allow',
        REQUEST_FOR_ALL_ASSET: 'request-all',
        REQUEST_FOR_ALL_ASSET_DENY: 'request-all-deny',
        REQUEST_FOR_ALL_ASSET_ALLOW: 'request-all-allow',
        UPLOAD_ASSET_REQUEST: 'upload'
    },
    API_TOKEN: 'apix:k27t5uuk3pWsJYbGP0Lognnvu2mZkUEH', //'pruvista:QrSWoila7LjmBqHmhJI0TZvH3rkFFVhp',
    SDK_TOKEN: 'apix:J2YLIb8JC6NLXJeUa8g7DPIhRhb9WgDz',
    APIX: {
        USERNAME: 'anand@datafornix.com',
        PASSWORD: 'TEMP@anand',
        ERROR_MSG: 'Invalid Credentials'
    }
};
