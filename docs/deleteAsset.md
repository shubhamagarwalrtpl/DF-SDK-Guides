# Data-Fornix-Web API : deleteAsset

This method is responsiable for delete asset from Datafornix databse.

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

Call `deleteAsset` method

```js
cosnt deleteObj = {
    'parrent_asset_type': `<Aset Type Passport, Driving Licence..>`
    'asset_id: `<Asset ID>`
}

const deleteAssetRes = dataFornixAPIInstance.deleteAsset(deleteObj);
// Return promise object
deleteAssetRes.then(function (data) {
    console.log(data)
}, function (error) {
    console.log(error);
});
```

### **Return Response**

`dataFornixAPIInstance.deleteAsset` will return a javascript promise object.
You can take different actions for success and failure response.
