# Data-Fornix-Web API : uploadAssetRequest

This method is responsiable for send list of upload asset request from Datafornix databse.

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

Call `uploadAssetRequest` method

```js
const userUploadAssetsRequestRes = dataFornixAPIInstance.uploadAssetRequest();
// Return promise object
userUploadAssetsRequestRes.then(function (data) {
    console.log(data)
}, function (error) {
    console.log(error);
});
```

### **Return Response**

`dataFornixAPIInstance.uploadAssetRequest` will return a javascript promise object.
You can take different actions for success and failure response.
