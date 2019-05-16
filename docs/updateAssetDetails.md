# Data-Fornix-Web API : updateAssetDetails

This method is responsiable for update asset data and store in Datafornix databse.

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

Call `updateAssetDetails` method

```js

/* demo update request object for licence */
const updateData = {
    'asset_type': <asset_type>,
    'first_name': <first_name>,
    'middle_name': <middle_name>,
    'last_name': <last_name>,
    'nationality': <nationality>,
    'geo_longitude': <geo_longitude>,
    'geo_latitude': <geo_latitude>,
    'licence_number': <licence_number>,
    'birth_date': <birth_date>,
    'issue_date': <issue_date>,
    'expiry_date': <expiry_date>,
    'address': <address>            
}

const updateAssetRes = dataFornixAPIInstance.updateAssetDetails(updateData);
// Return promise object
updateAssetRes.then(function (data) {
    console.log(data)
}, function (error) {
    console.log(error);
});
```

### **Return Response**

`dataFornixAPIInstance.updateAssetDetails` will return a javascript promise object.
You can take different actions for success and failure response.
