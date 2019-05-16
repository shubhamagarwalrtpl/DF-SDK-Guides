# Data-Fornix-Web API : selfieVerify

This method is responsiable for store user selfie image in Datafornix databse and send verification mail to user

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

Call `selfieVerify` method

```js
const selfieCheckRes = dataFornixAPIInstance.selfieVerify({
    profile_pic: <Form Data of Selfie image here>
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
    profile_pic: <Form Data of Selfie image here>
}
```
Name | Type | Description
------------ | ------------- | -------------
**profile_pic** | **File Object** | Selfie file object

### **Return Response**

`dataFornixAPIInstance.selfieVerify` will return a javascript promise object.
You can take different actions for success and failure response.
