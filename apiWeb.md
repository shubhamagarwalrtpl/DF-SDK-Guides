# Data-Fornix-Web API SDK

This Data-Fornix-Web API SDK provides a set of method's for JavaScript applications to verify user, capture and save data. 

## Getting Started

### 1. Obtaining an API token

In order to start integration, you will need the **API token**.

### 2. Including/Importing the library

#### 2.1 HTML Script Tag Include

Include it as a regular script tag on your page:

```html
<script src='dist/data-fornix-web-api.js'></script>
```

#### 2.2 NPM style import

You can also import it as a module into your own JS build system (tested with Webpack).


```sh
$ npm install --save data-fornix-web-api
```

```js
// ES6 module import
import DataFornixApi from 'data-fornix-web-api'

// commonjs style require
var DataFornixApi = require('data-fornix-web-api')
```

### 3. initializing the SDK

You are now ready to initialize the SDK:

```js
// Create instance of DataFornix Web API SDK
// and store it in `dataFornixAPIInstance` for future use
const dataFornixAPIInstance = new DataFornixApi(apiToken);
```

To verify that SDK is successfully initialized or not, you can pass callback function as second parameter

```js
const dataFornixAPIInstance = new DataFornixApi(
    apiToken,
    function (response) {
        console.log('api sdk ready to use', response);
    }
);
```

### 4. Create User

You also need to create user after SDK initialize and before any other sdk method call.

Call `createUser` method

```js
// dummy user object
const userData = {
    "email":"VALID_USER",
    "name":"USER_NAME",
    "phone_number":"USER_PHONE",
    "country_code":"USER_COUNTRY_CODE"
}

const createUserRes = dataFornixAPIInstance.createUser(userData);
// Return promise object
createUserRes.then(function (success) {
    // call SDK other methods here
    console.log('Call SDK other methods here')
}, function (error) {
    console.log('Error in create use => ', error);
});
```

#### Parameters

Following parameters are using to initialize API SDK:

- **`apiToken {String} required`**

  A API Token is required in order to authorise. If one isn’t present, an exception will be thrown.

- **`callback {Function} optional`**

  Callback function that fires when the Api SDk successfully initialized.

## Documentation for API Endpoints

Method | Description
------------- | ------------- |
[**createUser**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/CreateUser.md) | This method is for get user details from database before other api call.
[**createUserToken**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/CreateUserToken.md) | This method is for generate unique token for user and return saved details from database.
[**documentDataCapture**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/DocumentCapture.md) | This method is for capture data from provided documents.
[**documentDataSave**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/DocumentSave.md) | This method is for save captured document into database.
[**checkVideo**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/checkVideo.md) | Responsiable for store and verify user video.
[**SelfieVerify**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/SelfieVerify.md) | Responsiable for store and verify user selfie image.
[**getAssets**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/getAssets.md) | This method is responsiable for send all assets list.
[**deleteAsset**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/deleteAsset.md) | This method is responsiable for delete asset.
[**getSharedAssets**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/getSharedAssets.md) | This method is responsiable for send all user shared assets list.
[**organisationAssetRequest**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/organisationAssetRequest.md) | Responsiable for send list of organisation request for assets.
[**organisationAllAssetRequest**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/organisationAllAssetRequest.md) | Responsiable for send list of organisation request for all assets.
[**updateAssetDetails**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/updateAssetDetails.md) | Responsiable for update asset data and store.
[**uploadAssetRequest**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/uploadAssetRequest.md) | Responsiable for send list of upload asset request.
[**generateSelfieToken**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/generateSelfieToken.md) | Responsiable for get selfie token.
[**selfieVerifyWithToken**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/selfieVerifyWithToken.md) | Responsiable for send selfie using unique token.
[**getSelfieResult**](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/getSelfieResult.md) | Responsiable for get selfie match status with other asset.


## Documentation for Method

 - [createUser](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/CreateUser.md)
 - [createUserToken](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/CreateUserToken.md)
 - [documentDataCapture](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/DocumentCapture.md)
 - [documentDataSave](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/DocumentSave.md)
 - [checkVideo](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/checkVideo.md)
 - [SelfieVerify](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/SelfieVerify.md)
 - [getAssets](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/getAssets.md)
 - [deleteAsset](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/deleteAsset.md)
 - [getSharedAssets](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/getSharedAssets.md)
 - [organisationAssetRequest](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/organisationAssetRequest.md)
 - [organisationAllAssetRequest](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/organisationAllAssetRequest.md)
 - [updateAssetDetails](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/updateAssetDetails.md)
 - [uploadAssetRequest](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/uploadAssetRequest.md)
 - [generateSelfieToken](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/generateSelfieToken.md)
 - [selfieVerifyWithToken](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/selfieVerifyWithToken.md)
 - [getSelfieResult](https://github.com/anandramdeo-df/DF-ReadMes/blob/master/docs/getSelfieResult.md)