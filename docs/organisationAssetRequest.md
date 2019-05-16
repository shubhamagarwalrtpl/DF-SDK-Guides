# Data-Fornix-Web API : organisationAssetRequest

This method is responsiable for send list of organisation request for assets from Datafornix databse.

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

Call `organisationAssetRequest` method

```js
const organisationRequestRes = dataFornixAPIInstance.organisationAssetRequest();
// Return promise object
organisationRequestRes.then(function (data) {
    console.log(data)
}, function (error) {
    console.log(error);
});
```

### **Return Response**

`dataFornixAPIInstance.organisationAssetRequest` will return a javascript promise object.
You can take different actions for success and failure response.
