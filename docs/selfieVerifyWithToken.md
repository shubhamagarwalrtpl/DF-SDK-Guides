# Data-Fornix-Web API : selfieVerifyWithToken

This method is responsiable for store user selfie image with token.

## Use

Use DataFornix API SDK instance for call method

```js
// DataFornix API instance
const dataFornixAPIInstance = new DataFornixApi(
    apiToken,
    function (response) {
        console.log('api sdk ready to use', response);
    }
);
```

Call `selfieVerifyWithToken` method

```js
const selfieCheckRes = dataFornixAPIInstance.selfieVerifyWithToken({
    profile_pic: <Form Data of Selfie image here>,
    selfie_token: <Selfie Token here>
});
// Return promise object
selfieCheckRes.then(function (success) {
    console.log(success)
}, function (error) {
    console.log(error);
});
```

### **Request Parameters**

```js
{
    profile_pic: <Form Data of Selfie image here>,
    selfie_token: <Selfie Token here>
}
```
Name | Type | Description
------------ | ------------- | -------------
**profile_pic** | **File Object** | Selfie file object
**selfie_token** | **String** | Selfie token

### **Return Response**

`dataFornixAPIInstance.selfieVerifyWithToken` will return a javascript promise object.
You can take different actions for success and failure response.
