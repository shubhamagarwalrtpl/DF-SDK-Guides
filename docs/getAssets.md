# Data-Fornix-Web API : getAssets

This method is responsiable for send all assets list of user from Datafornix databse.

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

Call `getAssets` method

```js
const userAssets = dataFornixAPIInstance.getAssets();
// Return promise object
userAssets.then(function (data) {
    console.log(data)
}, function (error) {
    console.log(error);
});
```

### **Return Response**

`dataFornixAPIInstance.getAssets` will return a javascript promise object.
You can take different actions for success and failure response.
