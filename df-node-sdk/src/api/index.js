import { version } from '../../package.json';
import { Router } from 'express';
import ApiService from '../services/index';
import { CONSTANTS } from '../constant/index';
//import facets from './facets';
import request from 'request';
const path = require('path')
const fs = require('fs');

const defaultOptions = {
    'userId': '',
    'client': '',
    'apiToken': '',
    'geo_latitude': '40.7128',
    'geo_longitude': '-74.0060',
    'timezone': 'America/New_York'
};
let options = {},
    apiSdkObj,
    token;

let multer = require('multer');
// let upload = multer();
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + ext);
        },
    }),
})

export default ({ config, db }) => {
    let api = Router();

    // perhaps expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({ version });
    });

    // create user
    api.post('/create-user', (req, res) => {
        res.header('Content-Type', 'application/json');

        let tokenArr = [],
            userOptions = {};
        if (req.body.token) {
            tokenArr = req.body.token.split(':');
        }

        if (tokenArr.length > 1) {
            userOptions['client'] = tokenArr[0];
            userOptions['apiToken'] = tokenArr[1];
        }

        if (Intl.DateTimeFormat().resolvedOptions().timeZone) {
            defaultOptions['timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
        }

        options = {
            ...defaultOptions,
            ...userOptions
        };

        if (!options['client'] || !options['apiToken']) {
            res.send({ 'error': 'invalid token provied' });
        }

        if (req
            && req.body
            && req.body.email
            && req.body.name
            && req.body.phone_number
            && req.body.country_code
            && options.client
            && options.apiToken) {
            ApiService.generateRSAKeys((keyPair) => {
                const encryptionKeys = ApiService.getSaltWithAES(keyPair.publicKey);
                const headers = {
                    'Content-type': 'application/json',
                    'TOKEN': `${'Token'}${' '}${options.apiToken}`,
                    'X-SALT': `${encryptionKeys.salt}`,
                    'X-Authorization': `${keyPair.publicKey}`
                };

                request.post(
                    {
                        url: `${CONSTANTS.URL.BASE_URL}${options.client}${CONSTANTS.URL.API_VERSION}${CONSTANTS.URL.CREATE_USER_URL}`,
                        formData: { data: ApiService.getEncryptedData(req.body, encryptionKeys.aes) },
                        headers: headers
                    },
                    function optionalCallback(error, httpResponse, bodyResponse) {
                        let isSuccess = true;
                        if (error) {
                            res.send(error['message'] || error['detail'] || error);
                        }

                        let response = '';
                        if (bodyResponse && ApiService.IsJsonString(bodyResponse)) {
                            response = JSON.parse(bodyResponse);
                        }

                        if (response && response['iv'] && response['secret'] && response['data']) {
                            const key = ApiService.rsaDecryption(response['secret'], keyPair.privateKey);
                            if (key) {
                                const userData = ApiService.aesDecryption(key, response['iv'], response['data']);
                                const data = (userData.data) ? userData.data : userData;
                                if (data && data._id) {
                                    res.send(data);
                                } else {
                                    isSuccess = false;
                                }
                            } else {
                                isSuccess = false;
                            }
                        } else {
                            isSuccess = false;
                        }

                        if (!isSuccess) {
                            res.send({ 'error': 'Error in data decryption' });
                        }
                    }
                );
            });
        } else {
            reject('Invalid data provided.');
        }


        /* const createUserRes = apiSdkObj.createUser(data);
        createUserRes.then(function (success) {
            res.send(success);
        }, function (error) {
            res.send(error);
        }); */
    });

    // get ocr
    var cpUpload = upload.fields([{ name: 'front_image', maxCount: 1 }, { name: 'back_image', maxCount: 1 }])
    //var cpUpload = upload.any();
    api.post('/document-capture', cpUpload, (req, res) => {

        const document = {
            asset_type: req.body.asset_type || '',
            front_image: (req.files.front_image && req.files.front_image[0]) ? req.files.front_image[0] : '',
            back_image: (req.files.back_image && req.files.back_image[0]) ? req.files.back_image[0] : '',
            auth_token: req.body.auth_token || ''
        };

        if (!options.client || !options.apiToken) {
            res.send({ 'error': 'Call create user api first' });
        }

        if (document
            && document.asset_type
            && document.front_image
            && document.auth_token
            && options
            && options.client
            && options.apiToken) {
            ApiService.generateRSAKeys((keyPair) => {
                options['auth_token'] = document.auth_token;
                const encryptionKeys = ApiService.getSaltWithAES(keyPair.publicKey, document.auth_token);
                keyPair['salt'] = encryptionKeys.salt;
                const fd = {};
                const encData = ApiService.getEncryptedData({
                    asset_type: document.asset_type,
                    is_encryption_required: false // @TODO: sending encryption false for let api know that encryption not require here
                }, encryptionKeys.aes);

                fd['data'] = encData;
                fd['front_image'] = fs.createReadStream('uploads/' + document['front_image']['originalname']);
                if (document.back_image) {
                    fd['back_image'] = fs.createReadStream('uploads/' + document['back_image']['originalname']);
                }
                ApiService.ajaxPost(
                    `${CONSTANTS.URL.BASE_URL}${options.client}${CONSTANTS.URL.API_VERSION}${CONSTANTS.URL.GET_OCR_DATA_URL}`,
                    fd,
                    options,
                    keyPair,
                    res,
                    true
                );
            });
        } else {
            res.send({'error': 'Invalid data provided.'});
        }

        /* const documentCaptureRes = apiSdkObj.documentDataCapture(data);
        documentCaptureRes.then(function (success) {
            console.log('User created successfully => ', success)
            res.send(success);
        }, function (error) {
            console.log('Error in create use => ', error);
            res.send(error);
        }); */
    });

    return api;
}
