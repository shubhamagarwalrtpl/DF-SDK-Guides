# Data-Fornix-Web API : generateSelfieToken

This method is responsiable for get unique key for selfie capture.

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

Call `generateSelfieToken` method

```js
const selfieCheckRes = dataFornixAPIInstance.generateSelfieToken({
});
// Return object {'selfie_token': <TOKEN>}
selfieCheckRes.then(function (res) {
    // res: {'selfie_token': <TOKEN>}
    console.log(res['selfie_token'])
}, function (error) {
    console.log(error);
});
```

### **Return Response**

`dataFornixAPIInstance.generateSelfieToken` will return following object.

```
{
    'selfie_token': <TOKEN>
}
```
You can use that *selfie_token* for selfie capture