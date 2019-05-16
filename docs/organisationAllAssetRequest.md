# Data-Fornix-Web API : organisationAllAssetRequest

This method is responsiable for send list of organisation request for all assets from Datafornix databse.

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

Call `organisationAllAssetRequest` method

```js
const organisationRequestAllRes = dataFornixAPIInstance.organisationAllAssetRequest();
// Return promise object
organisationRequestAllRes.then(function (data) {
    console.log(data)
}, function (error) {
    console.log(error);
});
```

### **Return Response**

`dataFornixAPIInstance.organisationAllAssetRequest` will return a javascript promise object.
You can take different actions for success and failure response.
