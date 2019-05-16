# Data-Fornix-Web API : getSharedAssets

This method is responsiable for send all user shared assets list from Datafornix databse.

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

Call `getSharedAssets` method

```js
const userSharedAssets = dataFornixAPIInstance.getSharedAssets();
// Return promise object
userSharedAssets.then(function (data) {
    console.log(data)
}, function (error) {
    console.log(error);
});
```

### **Return Response**

`dataFornixAPIInstance.getSharedAssets` will return a javascript promise object.
You can take different actions for success and failure response.
