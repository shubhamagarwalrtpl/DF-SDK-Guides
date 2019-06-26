import JSEncrypt from 'node-jsencrypt';
import CryptoJS from '../lib/crypto-js.min';
import { CONSTANTS } from '../constant/index';
import bcrypt from 'bcryptjs';
import request from 'request';
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class ApiService {
    /**
     * RSA Key Decryption
     * @param {String} encrypted 
     * @param {String} privateKey 
     */
    static rsaDecryption(encrypted, privateKey) {
        const decrypt = new JSEncrypt();
        decrypt.setPrivateKey(privateKey);
        const uncrypted = decrypt.decrypt(encrypted);

        if (uncrypted) {
            return uncrypted;
        }
        return false;
    }

    /**
     * bcrypst keys
     * @param {String} userID 
     * @param {String} XAuthorisation 
     */
    static getSaltWithAES(XAuthorisation, userID = "") {
        let salt = bcrypt.genSaltSync();
        let compositeString = CONSTANTS.COMPOSITE_STRING_PREFIX + userID + salt + XAuthorisation;
        let aes = bcrypt.hashSync(compositeString, salt);
        aes = aes.substring(aes.length - 32);
        return { salt, aes };
    }

    /**
     * bcrypst keys
     * @param {Object} data 
     * @param {String} aesKey 
     */
    static getEncryptedData(data, aesKey, isFile = false) {
        const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(data),
            CryptoJS.enc.Utf8.parse(aesKey),
            {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }
        );

        let encrypted = encryptedData.toString();
        /* if (isFile) {
            encrypted = encryptedData.toString();
        } */
        return encrypted;
    }

    /**
     * AES Description, Mode CBC, Padding PKCS7
     * @param {String} keyVal 
     * @param {String} ivVal 
     * @param {String} encryptVal 
     */
    static aesDecryption(keyVal, ivVal, encryptVal) {
        const key = CryptoJS.enc.Utf8.parse(keyVal),
            iv = CryptoJS.enc.Base64.parse(ivVal),
            encrypted = CryptoJS.enc.Base64.parse(encryptVal);

        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: encrypted },
            key,
            {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC
            });

        const uftDecoded = CryptoJS.enc.Utf8.stringify(decrypted);
        if (uftDecoded) {
            return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypted));
        }
        return false;
    }

    /**
     * RSA Key generation
     * @param {Function} callback 
     */
    static generateRSAKeys(callback) {
        const generateKey = new JSEncrypt({ default_key_size: 1024 }),
            publickey = generateKey.getPublicKeyB64(),
            privateKey = generateKey.getPrivateKeyB64();
        callback({ publicKey: publickey, privateKey: privateKey });
    }

    /**
     * Uuid key generation
     * @return unique id
     */
    static generateUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Verify string in valid json string before json parse
     * @param {String} str 
     */
    static IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * Handle Ajax Get Request
     * @param {String} url: Request URL
     * @param {Object} options: Request Options 
     * @param {Object} keyPair: RSA Keys
     * @param {Function} resolve: Promise Resolve
     * @param {Function} reject: Promise Reject
     */
    static ajaxGet(url, options, keyPair, resolve, reject) {
        const xhttp = new XMLHttpRequest(),
            self = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    let isSuccess = true;
                    const response = JSON.parse(this.responseText);
                    if (response && response['iv'] && response['secret'] && response['data']) {
                        const key = ApiService.rsaDecryption(response['secret'], keyPair.privateKey);
                        if (key) {
                            const assetsData = ApiService.aesDecryption(key, response['iv'], response['data']);
                            if (assetsData) {
                                resolve((assetsData.data) ? assetsData.data : assetsData);
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
                        reject('Error in data decryption');
                    }
                } else {
                    const error = (this.responseText && self.IsJsonString(this.responseText)) ? JSON.parse(this.responseText) : CONSTANTS.MESSAGE.ERROR.SERVER_ERROR;
                    reject(error['message'] || error);
                }
            }
        };
        xhttp.open('GET', url, true);
        xhttp.setRequestHeader('TOKEN', `${'Token'}${' '}${options.apiToken}`);
        xhttp.setRequestHeader('X-Authorization', `${keyPair.publicKey}`);
        xhttp.setRequestHeader('X-SALT', keyPair.salt);
        xhttp.setRequestHeader('Authorization', `${'bearer'}${' '}${options['userId']}`);
        xhttp.send();
    }

    /**
     * Handle Ajax Post Request
     * @param {String} url: Request URL
     * @param {Opject} data: Post Request data
     * @param {Object} options: Request Options 
     * @param {Object} keyPair: RSA Keys
     * @param {Function} resolve: Promise Resolve
     * @param {Function} reject: Promise Reject
     * @param {Boolean} isMultipart: value will be true if request support multipart/formdata
     */
    static ajaxPost(url, data, options, keyPair, backRes, isMultipart = false) {
        const headers = {
            'TOKEN': `${'Token'}${' '}${options.apiToken}`,
            'X-SALT': `${keyPair.salt}`,
            'X-Authorization': `${keyPair.publicKey}`,
            'Authorization': `${'bearer'}${' '}${options.auth_token}`
        };
        console.log('header', headers);
        if (!isMultipart) {
            headers['Content-Type'] = 'application/json';
        }

        request.post(
            {
                url: url,
                formData: data,
                headers: headers
            },
            function optionalCallback(error, httpResponse, bodyResponse) {
                let isSuccess = true;
                if (error) {
                    backRes.send({ 'error': error['message'] || error['detail'] || error });
                }

                let response = '';
                if (bodyResponse && ApiService.IsJsonString(bodyResponse)) {
                    response = JSON.parse(bodyResponse);
                }

                if (response) {
                    if (response['iv'] && response['secret'] && response['data']) {
                        const key = ApiService.rsaDecryption(response['secret'], keyPair.privateKey);
                        if (key) {
                            const assetsData = ApiService.aesDecryption(key, response['iv'], response['data']);
                            if (assetsData) {
                                backRes.send((assetsData.data) ? assetsData.data : assetsData);
                            } else {
                                isSuccess = false;
                            }
                        } else {
                            isSuccess = false;
                        }
                    } else if (response['message'] || response['detail']) {
                        backRes.send({ 'error': response['message'] || response['detail'] || CONSTANTS.MESSAGE.ERROR.DATA_DECRYPTION_ERROR });
                    } else {
                        isSuccess = false;
                    }
                }

                if (!isSuccess) {
                    backRes.send({ 'error': CONSTANTS.MESSAGE.ERROR.DATA_DECRYPTION_ERROR });
                }
            }
        );

        /* const xhttp = new XMLHttpRequest(),
            self = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    let isSuccess = true;
                    const response = JSON.parse(this.responseText);
                    if (response && response['iv'] && response['secret'] && response['data']) {
                        const key = ApiService.rsaDecryption(response['secret'], keyPair.privateKey);
                        if (key) {
                            const assetsData = ApiService.aesDecryption(key, response['iv'], response['data']);
                            if (assetsData) {
                                resolve((assetsData.data) ? assetsData.data : assetsData);
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
                        reject('Error in data decryption');
                    }
                } else {
                    const error = (this.responseText && self.IsJsonString(this.responseText)) ? JSON.parse(this.responseText) : CONSTANTS.MESSAGE.ERROR.SERVER_ERROR;
                    reject(error['message'] || error);
                }
            }
        };
        xhttp.open('POST', url, true);

        if (!isMultipart) {
            xhttp.setRequestHeader('Content-Type', 'application/json');
        }
        xhttp.setRequestHeader('TOKEN', `${'Token'}${' '}${options.apiToken}`);
        xhttp.setRequestHeader('X-Authorization', `${keyPair.publicKey}`);
        xhttp.setRequestHeader('X-SALT', keyPair.salt);
        xhttp.setRequestHeader('Authorization', `${'bearer'}${' '}${options['userId']}`);
        xhttp.send(data); */
    }

    /**
     * Handle Ajax Put Request
     * @param {String} url: Request URL
     * @param {Opject} data: Put Request data
     * @param {Object} options: Request Options 
     * @param {Object} keyPair: RSA Keys
     * @param {Function} resolve: Promise Resolve
     * @param {Function} reject: Promise Reject
     */
    static ajaxPut(url, data, options, keyPair, resolve, reject) {
        const xhttp = new XMLHttpRequest(),
            self = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    let isSuccess = true;
                    const response = JSON.parse(this.responseText);
                    if (response && response['iv'] && response['secret'] && response['data']) {
                        const key = ApiService.rsaDecryption(response['secret'], keyPair.privateKey);
                        if (key) {
                            const assetsData = ApiService.aesDecryption(key, response['iv'], response['data']);
                            if (assetsData) {
                                resolve((assetsData.data) ? assetsData.data : assetsData);
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
                        reject('Error in data decryption');
                    }
                } else {
                    const error = (this.responseText && self.IsJsonString(this.responseText)) ? JSON.parse(this.responseText) : CONSTANTS.MESSAGE.ERROR.SERVER_ERROR;
                    reject(error['message'] || error);
                }
            }
        };
        xhttp.open('PUT', url, true);
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.setRequestHeader('TOKEN', `${'Token'}${' '}${options.apiToken}`);
        xhttp.setRequestHeader('X-Authorization', `${keyPair.publicKey}`);
        xhttp.setRequestHeader('Authorization', `${'bearer'}${' '}${options['userId']}`);
        xhttp.setRequestHeader('X-SALT', keyPair.salt);
        xhttp.send(data);
    }

    /**
     * Handle Ajax Delete Request
     * @param {String} url: Request URL
     * @param {Object} options: Request Options 
     * @param {Object} keyPair: RSA Keys
     * @param {Function} resolve: Promise Resolve
     * @param {Function} reject: Promise Reject
     */
    static ajaxDelete(url, options, keyPair, resolve, reject) {
        const xhttp = new XMLHttpRequest(),
            self = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    let isSuccess = true;
                    const response = JSON.parse(this.responseText);
                    if (response && response['iv'] && response['secret'] && response['data']) {
                        const key = ApiService.rsaDecryption(response['secret'], keyPair.privateKey);
                        if (key) {
                            const assetsData = ApiService.aesDecryption(key, response['iv'], response['data']);
                            if (assetsData) {
                                resolve((assetsData.data) ? assetsData.data : assetsData);
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
                        reject('Error in data decryption');
                    }
                } else {
                    const error = (this.responseText && self.IsJsonString(this.responseText)) ? JSON.parse(this.responseText) : CONSTANTS.MESSAGE.ERROR.SERVER_ERROR;
                    reject(error['message'] || error);
                }
            }
        };
        xhttp.open('DELETE', url, true);
        xhttp.setRequestHeader('TOKEN', `${'Token'}${' '}${options.apiToken}`);
        xhttp.setRequestHeader('X-Authorization', `${keyPair.publicKey}`);
        xhttp.setRequestHeader('X-SALT', keyPair.salt);
        xhttp.setRequestHeader('Authorization', `${'bearer'}${' '}${options['userId']}`);
        xhttp.send();
    }
}

export default ApiService;